//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210', 'snap.svg_030'],
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

            var checkioInput = data.in;
            var checkioInputStr = fname + '(' + JSON.stringify(checkioInput) + ')';

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

            var svg = new YardSVG($content.find(".explanation")[0]);
            svg.draw(checkioInput);

            if (data.ext) {
                var rightResult = data.ext["answer"];
                var userResults = data.ext["recent_results"];
                var result = data.ext["result"];
                var result_addon = data.ext["message"];

                //if you need additional info from tests (if exists)
                var explanation = data.ext["explanation"];
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
            var attrNumb = {"stroke": colorBlue4, "fill": colorBlue4, "font-family": "Roboto", "font-weight": "bold", "font-size": cell / 2};
            var attrObst = {"stroke": colorBlue4, "fill": colorBlue4, "font-family": "Roboto", "font-size": cell * 1.3};


            var hobbits = [];
            var chicken;

            Raphael.fn.star = function (x, y, outR, inR) {
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

                return paper.path(path);
            };


            this.draw = function (data) {
                sizeX = data[0].length * cell + 2 * p;
                sizeY = data.length * cell + 2 * p;
                paper = Raphael(dom, sizeX, sizeY);

                for (var row = 0; row < data.length; row++) {
                    for (var col = 0; col < data[row].length; col++) {
                        paper.rect(p + cell * col, p + cell * row, cell, cell).attr(attrCell);
                        var ch = data[row][col];
                        if (ch == "C") {
                            chicken = paper.star(
                                p + cell * (col + 0.5), p + cell * (row + 0.5), cell / 3, cell / 6).attr(attrChicken);
                            chicken.row = row;
                            chicken.col = col;
                        }
                        if (ch == "1" || ch == "2") {
                            var index = Number(ch) - 1;
                            hobbits[index] = paper.set();
                            hobbits[index].push(
                                paper.circle(
                                    p + cell * (col + 0.5),
                                    p + cell * (row + 0.5),
                                    cell / 3).attr(attrHobbit));
                            hobbits[index].row = row;
                            hobbits[index].col = col;
                            hobbits[index].push(
                                paper.text(p + cell * (col + 0.5),
                                    p + cell * (row + 0.5), ch).attr(attrNumb));

                        }
                        if (ch == "X") {
                            paper.text(p + cell * (col + 0.5),
                                p + cell * (row + 0.65), "*").attr(attrObst)
                        }
                    }
                }


            }
        }

        //Your Additional functions or objects inside scope
        //
        //
        //


    }
);
