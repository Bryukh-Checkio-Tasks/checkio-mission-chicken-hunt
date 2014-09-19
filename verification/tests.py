"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "answer" -- your right answer
    "explanation" -- not necessary key, it's using for additional info in animation.
"""

TESTS = {
    "0. Example": [
        "......",
        ".1.XX.",
        "...CX.",
        ".XX.X.",
        "...2..",
        "......",
    ],
    "1. Tunnels": [
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
    "2. ChessBoard": [
        "1X.X.X.X2",
        "X.X.X.X.X",
        ".X.X.X.X.",
        "X.X.X.X.X",
        ".X.X.X.X.",
        "X.X.X.X.X",
        ".X.XCX.X.",
        "X.X.X.X.X",
    ],
    "3. Clear": [
        "...2...",
        ".......",
        ".......",
        "...C...",
        ".......",
        ".......",
        "...1...",
    ],
    "4. Chaos": [
        "..1..X..",
        ".X.XXX..",
        "....X...",
        ".X.XXX..",
        "..X..X..",
        "X..XC.X.",
        "....XX..",
        "..X..X..",
        "X..X2...",
    ],
    "5. Running": [
        ".........",
        ".XXXXXXX.",
        ".X.....X.",
        ".X.XXXCX.",
        ".X2....X.",
        ".X1XXXXX.",
        ".X.......",
        ".XXXXXXX.",
        ".........",
    ],
    "6. Passage": [
        ".......",
        ".XXXXX.",
        ".X1.2X.",
        ".X...X.",
        ".X...X.",
        ".XX.XX.",
        "C......",
    ],
    "7. Be calm": [
        ".XXX.",
        ".X1X.",
        ".XCX.",
        ".X2X.",
        ".XXX.",
    ],

}
