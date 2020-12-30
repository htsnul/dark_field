const stageDatas = [
  {
    table: [
      "################################",
      "#S  ####      ##################",
      "#   ####      ##################",
      "#                      #########",
      "########      ######## #########",
      "########  a   ######## #########",
      "########## ########### #########",
      "########## #########     #######",
      "##########            #  #######",
      "################# ##     #######",
      "################# #### #########",
      "################# #### #########",
      "################# ###  #########",
      "################# ##  ##########",
      "################# #  ###########",
      "################# # ############",
      "#################     ##########",
      "#################     ##########",
      "################     ###########",
      "################G   ############",
      "################################",
      "################################",
      "################################",
      "################################",
      "################################",
      "################################",
      "################################",
      "################################",
      "################################",
      "################################",
      "################################",
      "################################",
    ],
    enemies: {
      "G": {
        type: "Goal",
      },
      "a": {
        type: "Skeleton",
      },
    }
  },
  {
    table: [
      "################################",
      "#S #    #        # #    #      #",
      "## #  #  # #  ## # # ##   ## # #",
      "#  a#  # ## # #  # # #  # #  # #",
      "# # ## #    # #### # # # #  # ##",
      "#      # #### #    # # # # ## ##",
      "## ##### #    # #### #  #  #  ##",
      "#     #  # #### #    ###  #  # #",
      "# # # #### #    # ####   #  #  #",
      "#   #      # #### #    ##  #  ##",
      "### # ###### #    # ###   #  # #",
      "#   #          #### #   ##  #  #",
      "######## #######    ####   #  ##",
      "#      # #       ## #    ##  # #",
      "## ###   # ##   #   # ###   #  #",
      "#    ######   ##  ##  #   ##   #",
      "#### #      ##   #   #  ## # # #",
      "# #   # ####  ###  ##  #     # #",
      "#  ###  #         #   # ###### #",
      "#      #  ########  ##         #",
      "## ####  #         #  # ########",
      "##      #  ### ####       #    #",
      "## #####  #           # # # ## #",
      "##       #  ### # ##### #   ## #",
      "#########  #   #  #    #  ## # #",
      "#         #  # #  # ## #   # # #",
      "## #######  ### # #  # # # #   #",
      "#               # #### # #  ####",
      "#################      #  #   G#",
      "################################",
      "################################",
      "################################",
    ],
    enemies: {
      "G": {
        type: "Goal",
      },
      "a": {
        type: "Enemy3",
      },
    }
  },
];

export default stageDatas;
