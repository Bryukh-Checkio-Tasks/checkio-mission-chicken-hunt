from random import choice
from checkio.signals import ON_CONNECT
from checkio import api
from checkio.referees.io import CheckiOReferee
from checkio.referees import cover_codes
from checkio.referees import checkers
from multicall_sim import CheckioRefereeMultiSeveral

from tests import TESTS


DIRS = {
    "N": (-1, 0),
    "S": (1, 0),
    "E": (0, 1),
    "W": (0, -1),
    "NW": (-1, -1),
    "NE": (-1, 1),
    "SE": (1, 1),
    "SW": (1, -1),
    "": (0, 0),
}


def random_chicken(_, possible):
    return choice(possible)


CHICKEN_ALGORITHM = {
    "random": random_chicken
}

ERROR_TYPE = "Your function must return a direction as a string."
ERROR_FENCE = "A hobbit struck in the fence."
ERROR_TREE = "A hobbit struck in an obstacle."
ERROR_HOBBITS = "The Hobbits struck each other."
ERROR_TIRED = "The Hobbits are tired."

N = 2

MAX_STEP = 100


def find_position(yard, symb):
    for i, row in enumerate(yard):
        for j, ch in enumerate(row):
            if ch == symb:
                return i, j
    return None, None


def find_free(yard, position):
    x, y = position
    result = []
    for k, (dx, dy) in DIRS.items():
        nx, ny = x + dx, y + dy
        if 0 <= nx < len(yard) and 0 <= ny < len(yard[0]) and yard[nx][ny] == ".":
            result.append((k, (nx, ny)))
    return result


def initial(data):
    yard1 = [row.replace("1", "I").replace("2", "S") for row in data]
    yard2 = [row.replace("1", "S").replace("2", "I") for row in data]
    return {"input": data, "input0": yard1, "input1": yard2}

def process(data):
    yard = data["input"]
    results = data["recent_results"]
    chicken_algorithm = CHICKEN_ALGORITHM.get(data.get("chicken_algorithm", "random"))
    if any(not isinstance(r, str) or r not in DIRS.keys() for r in results):
        data.update({"result": False, "is_win": False, "message": ERROR_TYPE})
        return data
    chicken = find_position(yard, "C")
    possibles = find_free(yard, chicken)
    chicken_action, new_chicken = chicken_algorithm(yard, possibles)
    data.update({"chicken": new_chicken, "chicken_action": chicken_action})
    positions = [find_position(yard, str(i + 1)) for i in range(N)]
    new_positions = []
    for i, (x, y) in enumerate(positions):
        nx, ny = x + DIRS[results[i]][0], y + DIRS[results[i]][1]
        if nx < 0 or nx >= len(yard) or ny < 0 or ny >= len(yard[0]):
            data.update({"result": False, "is_win": False, "message": ERROR_FENCE})
            return data
        if yard[nx][ny] == "X":
            data.update({"result": False, "is_win": False, "message": ERROR_TREE})
            return data
        new_positions.append((nx, ny))
    if len(set(new_positions)) != len(new_positions):
        data.update({"result": False, "is_win": False, "message": ERROR_HOBBITS})
        return data

    if any(new_chicken == pos for pos in new_positions):
        data.update({"result": True, "is_win": True, "message": "Gratz!"})
        return data

    if data["step"] >= MAX_STEP:
        data.update({"result": False, "is_win": False, "message": ERROR_TIRED})
        return data

    new_yard = [[ch if ch in ".X" else "." for ch in row] for row in yard]
    for i, (x, y) in enumerate(new_positions):
        new_yard[x][y] = str(i + 1)
    new_yard[new_chicken[0]][new_chicken[1]] = "C"
    data["input"] = tuple("".join(row) for row in new_yard)
    data["input0"] = [row.replace("1", "I").replace("2", "S") for row in data["input"]]
    data["input1"] = [row.replace("1", "S").replace("2", "I") for row in data["input"]]

    data.update({"result": True, "is_win": False, "message": "Next"})
    return data


cover3 = """def cover(f, data):
    return f(tuple(data))
"""

cover2 = """def cover(f, data):
    return f(tuple(str(row) for row in data))
"""



api.add_listener(
    ON_CONNECT,
    CheckioRefereeMultiSeveral(
        tests=TESTS,
        quantity=2,
        function_name="hunt",
        initial_referee=initial,
        process_referee=process,
        is_win_referee=None,
        cover_code={
            'python-27': cover2,
            'python-3': cover3
        },
        # checker=None,  # checkers.float.comparison(2)
        # add_allowed_modules=[],
        # add_close_builtins=[],
        # remove_allowed_modules=[]
    ).on_ready)
