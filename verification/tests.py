"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "answer" -- your right answer
    "explanation" -- not necessary key, it's using for additional info in animation.
"""

TESTS = {
    "00. Example Random": {
        "yard": ["......",
                 ".1.XX.",
                 "...CX.",
                 ".XX.X.",
                 "...2..",
                 "......"],
        "chicken_algorithm": "random",
    },
    "01. Example Away": {
        "yard": ["......",
                 ".1.XX.",
                 "...CX.",
                 ".XX.X.",
                 "...2..",
                 "......"],
        "chicken_algorithm": "run_away",
    },
    "02. Example Hunter": {
        "yard": ["......",
                 ".1.XX.",
                 "...CX.",
                 ".XX.X.",
                 "...2..",
                 "......"],
        "chicken_algorithm": "hunter",
    },

    "10. Tunnels": {
        "yard": [
            "1.........",
            ".X.X.X.X.X",
            ".X.X.X.X.X",
            ".X.X.X.X.X",
            ".X.X.X.X.X",
            ".X.XCX.X.X",
            ".X.X.X.X.X",
            ".X.X.X.X.X",
            ".X.X.X.X.X",
            ".X.X.X.X.X",
            ".........2",
        ],
        "chicken_algorithm": "run_away"
    },
    "20. ChessBoard": {
        "yard": [
            "1X.X.X.X2",
            "X.X.X.X.X",
            ".X.X.X.X.",
            "X.X.X.X.X",
            ".X.X.X.X.",
            "X.X.X.X.X",
            ".X.XCX.X.",
            "X.X.X.X.X",
        ]},
    "30. Clear Random": {
        "yard": [
            "...2...",
            ".......",
            ".......",
            "...C...",
            ".......",
            ".......",
            "...1...",
        ], "chicken_algorithm": "random"},
    "31. Clear Away": {
        "yard": [
            "...2...",
            ".......",
            ".......",
            "...C...",
            ".......",
            ".......",
            "...1...",
        ], "chicken_algorithm": "run_away"},
    "32. Clear Hunter": {
        "yard": [
            "...2...",
            ".......",
            ".......",
            "...C...",
            ".......",
            ".......",
            "...1...",
        ], "chicken_algorithm": "hunter"},

    "40. Chaos": {
        "yard": [
            "..1..X..",
            ".X.XXX..",
            "....X...",
            ".X.XXX..",
            "..X..X..",
            "X..XC.X.",
            "....XX..",
            "..X..X..",
            "X..X2...",
        ], },
    "41. Chaos": {
        "yard": [
            "..1..X..",
            ".X.XXX..",
            "....X...",
            ".X.XXX..",
            "..X..X..",
            "X..XC.X.",
            "....XX..",
            "..X..X..",
            "X..X2...",
        ], "chicken_algorithm": "hunter"},

    "51. Running": {
        "yard": [
            ".........",
            ".XXXXXXX.",
            ".X.....X.",
            ".X.XXXCX.",
            ".X2....X.",
            ".X1XXXXX.",
            ".X.......",
            ".XXXXXXX.",
            ".........",
        ], "chicken_algorithm": "run_away"},
    "61. Passage": {
        "yard": [
            ".......",
            ".XXXXX.",
            ".X1.2X.",
            ".X...X.",
            ".X...X.",
            ".XX.XX.",
            "C......",
        ], "chicken_algorithm": "run_away"},
    "71. Be calm": {
        "yard": [
            ".XXX.",
            ".X1X.",
            ".XCX.",
            ".X2X.",
            ".XXX.",
        ], },
    "8. Maze": {
        "yard": [
            "..........",
            ".XXXXXXXX.",
            ".X.X....2.",
            ".X...XXXX.",
            ".X.X.X.1X.",
            ".X.X.X..X.",
            ".X.X.XX.X.",
            ".X.XX...X.",
            ".XXCXXXXX.",
            "..........",
        ], "chicken_algorithm": "run_away"},
    "9. Hangover": {
        "yard": [
            "....C....",
            ".XXX.XXX.",
            ".X1XXX2X.",
            ".XX.X.XX.",
            ".XXX.XXX.",
            "...X.X...",
            "...X.X...",
            ".........",
        ], },

}
