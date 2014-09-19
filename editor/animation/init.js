//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_212', 'snap.svg_030'],
    function (ext, $, Raphael, Snap) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide = {};
            cur_slide["in"] = data[0];
            this_e.addAnimationSlide(cur_slide);
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            //YOUR FUNCTION NAME
            var fname = 'hunt';

            var checkioInput = data.in || [
                "......",
                ".1.XX.",
                "...CX.",
                ".XX.X.",
                "...2..",
                "......"];
            console.log(data.in);
            var checkioInputStr = "";
            for (var h = 1; h < 3; h++) {
                checkioInputStr += fname + '(' + JSON.stringify(checkioInput[0]).replace(String(h), "I").replace(String(3 - h));
                for (var j = 1; j < checkioInput.length; j++) {
                    checkioInputStr += ",<br>     " +
                        JSON.stringify(checkioInput[j]).replace(String(h), "I").replace(String(3 - h), "S");
                }
                checkioInputStr += ")<br>";


            }

            var failError = function (dError) {
                $content.find('.call').html(checkioInputStr);
                $content.find('.output').html(dError.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
            };

            if (data.error) {
                failError(data.error);
                return false;
            }

            if (data.ext && data.ext.inspector_fail) {
                failError(data.ext.inspector_result_addon);
                return false;
            }

            $content.find('.call').html(checkioInputStr);
            $content.find('.output').html('Working...');

            var svg = new YardSVG($content.find(".explanation svg")[0]);
            svg.draw(checkioInput);

            if (data.ext) {
                var rightResult = data.ext["answer"];
                var userResults = data.ext["recent_results"];
                var result = data.ext["result"];
                var result_addon = data.ext["message"];

                //if you need additional info from tests (if exists)
                var explanation = data.ext["explanation"];

                setTimeout(function () {
                    svg.moving(data.ext)
                }, 200);

                $content.find('.output').html('&nbsp;Your results:&nbsp;' + userResults);
                if (!result) {
                    $content.find('.answer').html(result_addon);
                    $content.find('.answer').addClass('error');
                    $content.find('.output').addClass('error');
                    $content.find('.call').addClass('error');
                }
                else {
                    $content.find('.answer').remove();
                }
            }
            else {
                $content.find('.answer').remove();
            }


            //Your code here about test explanation animation
            //$content.find(".explanation").html("Something text for example");
            //
            //
            //
            //
            //


            this_e.setAnimationHeight($content.height() + 60);

        });

        //This is for Tryit (but not necessary)
//        var $tryit;
//        ext.set_console_process_ret(function (this_e, ret) {
//            $tryit.find(".checkio-result").html("Result<br>" + ret);
//        });
//
//        ext.set_generate_animation_panel(function (this_e) {
//            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit'))).find('.tryit-content');
//            $tryit.find('.bn-check').click(function (e) {
//                e.preventDefault();
//                this_e.sendToConsoleCheckiO("something");
//            });
//        });
        function YardSVG(dom) {
            var colorOrange4 = "#F0801A";
            var colorOrange3 = "#FA8F00";
            var colorOrange2 = "#FAA600";
            var colorOrange1 = "#FABA00";

            var colorBlue4 = "#294270";
            var colorBlue3 = "#006CA9";
            var colorBlue2 = "#65A1CF";
            var colorBlue1 = "#8FC7ED";

            var colorGrey4 = "#737370";
            var colorGrey3 = "#9D9E9E";
            var colorGrey2 = "#C5C6C6";
            var colorGrey1 = "#EBEDED";

            var colorWhite = "#FFFFFF";

            var paper;
            var cell = 40;
            var sizeX, sizeY;


            var p = 10;

            var attrCell = {"stroke": colorBlue4, "stroke-width": 2, "fill": colorBlue1};
            var attrChicken = {"stroke": colorBlue4, "stroke-width": 2, "fill": colorOrange2};
            var attrHobbit = {"stroke": colorBlue4, "stroke-width": 2, "fill": colorOrange1};
            var attrNumb = {"stroke": colorBlue4, "fill": colorBlue4,
                "font-family": "Roboto", "font-weight": "bold",
                "font-size": cell / 2, "text-anchor": "middle", "alignment-baseline": "central"};
            var attrObst = {"stroke": colorBlue4, "fill": colorBlue4,
                "font-family": "Roboto", "font-size": cell * 1.3, "text-anchor": "middle", "alignment-baseline": "central"};


            var hobbits;
            var chicken;
            var obstacles;

            var star = function (x, y, outR, inR) {
                var path = "M" + x + "," + (y - outR);

                for (var c = 2; c < 11; c += 2) {
                    var angleOuter = c * 36 - 90,
                        angleInner = (c - 1) * 36 - 90,
                        orx = x + outR * Math.cos(angleOuter * Math.PI / 180),
                        ory = y + outR * Math.sin(angleOuter * Math.PI / 180),
                        irx = x + inR * Math.cos(angleInner * Math.PI / 180),
                        iry = y + inR * Math.sin(angleInner * Math.PI / 180);

                    path += "L" + irx + "," + iry;
                    path += "L" + orx + "," + ory;
                }

                path += "Z";

                return path;
            };


            this.draw = function (data) {
                sizeX = data[0].length * cell + 2 * p;
                sizeY = data.length * cell + 2 * p;
                paper = Snap(dom);
                paper.attr({"width": sizeX, "height": sizeY});

                obstacles = paper.g();
                hobbits = paper.g();
                var grid = paper.g();

                for (var row = 0; row < data.length; row++) {
                    for (var col = 0; col < data[row].length; col++) {
                        grid.add(paper.rect(p + cell * col, p + cell * row, cell, cell).attr(attrCell));
                        var ch = data[row][col];
                        if (ch == "C") {
                            chicken = paper.path(star(
                                p + cell * (col + 0.5), p + cell * (row + 0.5), cell / 3, cell / 6)).attr(attrChicken);
                            chicken.row = row;
                            chicken.col = col;
                        }
                        if (ch == "1" || ch == "2") {
                            var index = Number(ch) - 1;
                            hobbits[index] = paper.g();
                            hobbits[index].add(
                                paper.circle(
                                    p + cell * (col + 0.5),
                                    p + cell * (row + 0.5),
                                    cell / 3).attr(attrHobbit));
                            hobbits[index].row = row;
                            hobbits[index].col = col;
                            hobbits[index].add(
                                paper.text(p + cell * (col + 0.5),
                                    p + cell * (row + 0.5), ch).attr(attrNumb));

                        }
                        if (ch == "X") {
                            obstacles.add(paper.text(p + cell * (col + 0.5),
                                p + cell * (row + 0.65), "*").attr(attrObst));
                        }
                    }
                }

                paper.append(grid);
                paper.append(hobbits[0]);
                paper.append(hobbits[1]);
                paper.append(chicken);
                paper.append(obstacles);
//                hobbits.after(grid);
//                chicken.insertAfter(grid);
//                chicken.after(hobbits);
//                obstacles.insertAfter(grid);
//                obstacles.insertAfter(hobbits);
//                obstacles.after(grid);
//                obstacles.after(hobbits);
//                obstacles.toFront();

                paper.rect(p, p, sizeX - 2 * p, sizeY - 2 * p).attr({"stroke": colorBlue4, "stroke-width": 4, "fill-opacity": 0});


            };

            var good_steps = ["N", "S", "W", "E", "NW", "NE", "SW", "SE", ""];

            var dirs = {
                "N": [0, -cell],
                "S": [0, cell],
                "E": [cell, 0],
                "W": [-cell, 0],
                "NW": [-cell, -cell],
                "NE": [cell, -cell],
                "SE": [cell, cell],
                "SW": [-cell, cell],
                "": [0, 0]};

            var stepTime = 300;

            this.moving = function (data) {
                var moves = data["recent_results"];
                for (var i = 0; i < moves.length; i++) {
                    var m = moves[i];
                    if (typeof(m) != "string" || good_steps.indexOf(m) === -1) {
                        continue;
                    }
                    var h = hobbits[i];
                    h.animate({"transform": "t" + dirs[m][0] + "," + dirs[m][1]}, stepTime);
                }
                var chicken_move = data["chicken_action"];
                if (chicken_move !== undefined) {
                    chicken.animate({"transform": "t" + dirs[chicken_move][0] + "," + dirs[chicken_move][1]}, stepTime);
                }
            }
        }

        //Your Additional functions or objects inside scope
        //
        //
        //


    }

)
;
