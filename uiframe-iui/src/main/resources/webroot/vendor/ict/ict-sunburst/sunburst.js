var sunburstGraph = {};
sunburstGraph.refreshGraph = function (skillsdata, divId, settings) {
    //先删除div下面的所有child
    $('#' + divId).children().remove();
    skillsdata.count = 0;
    var suburstContent = '<div class="skills-sunburst">'
            //+'<div id="explanation" style="visibility: hidden;">'
            //+'<span id="percentage"></span><br/>'
            //+'<span id="source"></span>'
            //+'</div>'
        + '</div>'
        + '<div id="skills-chart-breadcrumb"></div>';
    //$('#' + divId).append('<div id="skills-chart-breadcrumb"></div>');
    $('#' + divId).append(suburstContent);
    //$(suburstContent).appendTo($('#' + divId));

    //计算总的日志数量
    function count(sourceOjb) {
        for (var childname in sourceOjb) {
            var child = sourceOjb[childname];
            if (child && child[0] >= 0) { //判断是否内容为数字
                for (var num in child) {
                    skillsdata.count = skillsdata.count + child[num];
                }
            } else {
                count(child);
            }
        }
    }

    var statisticCount = count(skillsdata);

    function getOneBurstName(burst) {
        var key = JSON.parse(burst.key);
        return key.name;
    }

    function getDataCount(data) {
        var dataCount = 0;
        for (var index in data._proficiency) {
            dataCount = dataCount + data._proficiency[index];
        }
        ;
        return dataCount;
    }

    function mouseover(data) {

        //这里修改vm中的数据对象--selectLogStaInfo ，刷新右边的barGraph.
        if (settings.mouseOverCallback) {
            settings.mouseOverCallback(data._proficiency);
        }

        var c = getcrumbpath(data);
        var dataCount = getDataCount(data);
        var percentage = (100 * dataCount / skillsdata.count).toPrecision(3);
        var percentageString = percentage + "%";
        if (percentage < 0.1) {
            percentageString = "< 0.1%";
        }
        refreshBreadCrum(c, percentageString);
        d3.select("#percentage")
            .text(percentageString);
        d3.select("#source")
            .text(getOneBurstName(data));
        d3.select("#explanation")
            .style("visibility", "");
        d3
            .selectAll(".skills-sunburst path")
            .style("opacity", .3), sunburst
            .selectAll("path")
            .filter(function (a) {
                return c.indexOf(a) >= 0
            })
            .style("opacity", 1)
    }

    function mouseleave() {
        d3
            .selectAll("path")
            .on("mouseover", null);
        d3
            .selectAll("path")
            .transition()
            .duration(1e3)
            .style("opacity", 1)
            .each("end", function () {
                d3.select(this).on("mouseover", mouseover)
            })
    }

    function getcrumbpath(a) {
        for (var temp = [], c = a; c.parent;) temp.unshift(c), c = c.parent;
        return temp
    }

    function initbreadcrumb() {
        d3
            .select("#skills-chart-breadcrumb")
            .append("svg:svg")
            .attr("width", 800)
            .attr("height", 30)
            .attr("class", "trail")
            .append("svg:text")
            .attr("id", "endlabel")
            .style("fill", "#000");
    }

    function h(a, d3) {
        var c = [];
        c.push("0,0");
        c.push(r.w + ",0");
        c.push(r.w + r.t + "," + r.h / 2);
        c.push(r.w + "," + r.h);
        c.push("0," + r.h);
        d3 > 0 && c.push(r.t + "," + r.h / 2);
        return c.join(" ");
    }

    function refreshBreadCrum(a, percentageString) {
        a[a.length - 1]._color, a.length;
        var c = d3
            .select("#skills-chart-breadcrumb .trail")
            .selectAll("g")
            .remove();
        c = d3
            .select("#skills-chart-breadcrumb .trail")
            .selectAll("g")
            .data(a, function (a) {
                return a.key + a.depth
            });
        var d = c.enter().append("svg:g");
        d
            .append("svg:polygon")
            .attr("points", h)
            .style("fill", function (a) {
                return a._color
            }),
            d
                .append("svg:text")
                .attr("x", r.w / 2 + 2)
                .attr("y", r.h / 2)
                .attr("dy", "0.50em")
                .attr("text-anchor", "middle")
                .attr("class", "breadcumb-text")
                .style("fill", function (a) {
                    return getcolor(d3.rgb(a._color)) < 150 ? "#fff" : "#000"
                })
                .text(function (a) {
                    return getOneBurstName(a);
                }),
            c
                .attr("transform", function (a, b) {
                    return "translate(" + b * (r.w + r.s) + ", 0)"
                }),
            b = {
                w: 120, h: 30, s: 10, t: 10
            };
        //
        d3
            .select("#skills-chart-breadcrumb .trail")
            .select("#endlabel")
            .attr("x", (a.length + 0.5) * (b.w + b.s))
            .attr("y", b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(percentageString);
        c.exit().remove();

        // Now move and update the percentage at the end.
        d3.select(".trail").style("visibility", "");
    }

    function getcolor(color) {
        return .299 * color.r + .587 * color.g + .114 * color.b
    }

    function k(a) {
        var color = ["#3399CC", "#FFC65D", "#CDB99C", "#8B4789", "#FF7F50"],
            d = [-.1, -.05, 0];
        if (1 == a.depth) {
            var e = color[coloralternative % 5];
            return coloralternative++, e
        }
        if (a.depth > 1) {
            var f = d[a.value % 3];
            return d3.rgb(a.parent._color).brighter(.15 * a.depth + f * a.depth)
        }
    }

    var l;


    width = settings.width,
        height = settings.height,
        rad = Math.min(width, height) / Math.PI - 25,
        q = k,
        r = {        //定义每一条面包屑的长、宽、高等
            w: 140, //宽度
            h: 30,  //面包屑的尖角相关。
            s: 3,
            t: 7
        },
        sunburst = d3
            .select(".skills-sunburst")
            .append("svg:svg")
            .attr("width", width)
            .attr("height", height)
            .append("svg:g")
            .attr("transform", "translate(" + (width / 2) + "," + height / 2 + ")");
    sunburst.append("svg:circle").attr("r", rad).style("opacity", 0);

    var mergeAry = function (sourceAry1, sourceAry2) {
            var rtnAry = [],
                aryLength = sourceAry1.length;
            if (sourceAry1.length !== sourceAry2.length) {
                rtnAry = sourceAry1.length > sourceAry2.length ? sourceAry1 : sourceAry2;
            } else for (var e = 0; aryLength > e; e++) {
                //var f = Math.max(sourceAry1[e], sourceAry2[e]) - Math.abs(sourceAry1[e] - sourceAry2[e]) / 8;
                rtnAry.push(sourceAry1[e] + sourceAry2[e]);
            }
            return rtnAry;
        },
        recursionFindAry = function (a) {
            if (a instanceof Array) return a;
            var b = [];
            return $.each(a, function (a, c) {
                b = mergeAry(recursionFindAry(c), b)
            }), b
        },
        countAry = function (data) {
            var countAry = 0;
            for (var i = 0; i < data.length; i++) {
                countAry = countAry + data[i];
            }
            return countAry;
        },
        proficiencydata = d3
            .layout
            .partition()
            .sort(null)
            .size([2 * Math.PI, rad])
            .children(function (a) {
                return a.value instanceof Array
                    ? (a._proficiency = a.value, d3.entries([countAry(a.value)]))
                    : (a._proficiency = recursionFindAry(a.value), isNaN(a.value) ? d3.entries(a.value) : null)
            })
            .value(function (a) {
                return a.value
            }),
        arc = d3.svg
            .arc()
            .startAngle(function (a) {//startAngle和endAngle是计算的每个环的每个角的角度，跟大小没有关系。
                return a.x
            })
            .endAngle(function (a) {
                return a.x + a.dx - .01 / (a.depth + .4)
            })
            .innerRadius(function (a) { //里层环线的位置，原来是没有增加20的，这里减少了层次，svg画布和旭日图之间空得太多，因此增加环的大小
                return rad / Math.PI * a.depth + 20
            })
            .outerRadius(function (a) { //外层环线的位置
                return rad / Math.PI * (a.depth + 1) + 22
            });

    var coloralternative = 0
    initbreadcrumb();
    var path = sunburst
        .data(d3.entries(skillsdata))
        .selectAll("g")
        .data(proficiencydata)
        .enter()
        .append("svg:g")
        .attr("display", function (a) {
            return a.depth ? null : "none"
        });
    path
        .append("svg:path")
        .attr("d", arc)
        .attr("stroke", "#fff")
        .attr("fill", function (a) {
            return a._color = q(a), a._color
        })
        .attr("fill-rule", "evenodd").attr("display", function (a) {
            return a.children ? null : "none"
        })
        .on("mouseover", mouseover);

    d3
        .select(".skills-sunburst")
        .on("mouseleave", mouseleave);
    //l = path.node().__data__.value;
    sunburst
        .append("circle")
        .attr("r", rad / Math.PI)
        .attr("opacity", 0);

    sunburst.append("text").transition().duration(1000)
        .attr("dx", function (d) {
            return 0;
        })
        .attr("dy", function (d) {
            return -10;
        })
        .attr("id", "percentage")
        .text(function (d) {
            return '';
        });
    sunburst.append("text").transition().duration(1000)
        .attr("dx", function (d) {
            return 0;
        })
        .attr("dy", function (d) {
            return 20;
        })
        .attr("id", "source")
        .text(function (d) {
            return '';
        });

}
