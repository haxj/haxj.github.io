"use strict";
import * as d3 from 'd3';

const country_info = {
    "Japan"               : [ "🇯🇵"    , "Nhật Bản" ],
    "Germany"             : [ "🇩🇪"    , "Đức" ],
    "Singapore"           : [ "🇸🇬"    ,  ],
    "France"              : [ "🇫🇷"    , "Pháp" ],
    "China"               : [ "🇨🇳"    , "Trung Quốc" ],
    "United States"       : [ "🇺🇸"    , "Hoa Kỳ" ],
    "Australia"           : [ "🇦🇺"    ,  ],
    "South Korea"         : [ "🇰🇷"    , "Hàn Quốc" ],
    "Hong Kong"           : [ "🇭🇰"    ,  ],
    "United Kingdom"      : [ "🇬🇧"    , "Anh" ],
    "Indonesia"           : [ "🇮🇩"    ,  ],
    "Malaysia"            : [ "🇲🇾"    ,  ],
    "Netherlands"         : [ "🇳🇱"    , "Hà Lan" ],
    "Belgium-Luxembourg"  : [ "🇧🇪 🇱🇺" , "Bỉ-Luxembourg" ],
    "Spain"               : [ "🇪🇸"    , "Tây Ban Nha" ],
    "Canada"              : [ "🇨🇦"    ,  ],
    "Poland"              : [ "🇵🇱"    , "Ba Lan" ],
    "Algeria"             : [ "🇩🇿"    ,  ],
    "Thailand"            : [ "🇹🇭"    , "Thái Lan" ],
    "Austria"             : [ "🇦🇹"    , "Áo" ],
    "Philippines"         : [ "🇵🇭"    ,  ],
    "Italy"               : [ "🇮🇹"    , "Ý" ],
    "Cote d'Ivoire"       : [ "🇨🇮"    , "Bờ Biển Ngà" ],
    "Taiwan"              : [ "🇹🇼"    , "Đài Loan" ],
    "Belgium"             : [ "🇧🇪"    , "Bỉ" ],
    "Iraq"                : [ "🇮🇶"    ,  ],
    "Cambodia"            : [ "🇰🇭"    , "Campuchia" ],
    "Switzerland"         : [ "🇨🇭"    , "Thụy Sỹ" ],
    "India"               : [ "🇮🇳"    , "Ấn Độ" ],
    "United Arab Emirates": [ "🇦🇪"    , "UAE" ],
    "Mexico"              : [ "🇲🇽"    ,  ],
    "New Zealand"         : [ "🇳🇿"    ,  ],
    "Denmark"             : [ "🇩🇰"    , "Đan Mạch" ],
    "Saudi Arabia"        : [ "🇸🇦"    ,  ],
    "Russia"              : [ "🇷🇺"    , "Nga" ],
    "Sweden"              : [ "🇸🇪"    , "Thụy Điển" ],
    "Kuwait"              : [ "🇰🇼"    ,  ],
    "Ukraine"             : [ "🇺🇦"    ,  ],
    "Argentina"           : [ "🇦🇷"    ,  ],
    "Brazil"              : [ "🇧🇷"    ,  ],
    "Israel"              : [ "🇮🇱"    ,  ],
    "Ireland"             : [ "🇮🇪"    ,  ],
    "Ecuador"             : [ "🇪🇨"    ,  ],
};

let font_sans_serif = "'Open Sans', sans-serif";

function draw_chart(data_orig, dom_id) {
    let width = d3.select(dom_id)
        .node()
        .getBoundingClientRect()
        .width;

    let n = 10;

    let countries = new Set(data_orig.map(d => d.country));

    let datevalues = Array.from(d3.rollup(data_orig, ([d]) => d.value, d => +d.date, d => d.country))
        .map(([date, data]) => [new Date(date), data])
        .sort(([a], [b]) => d3.ascending(a, b));

    function rank(value) {
        const data = Array.from(countries, country => ({country, value: value(country)}));
        data.sort((a, b) => d3.descending(a.value, b.value));
        for (let i = 0; i < data.length; ++i)
            data[i].rank = Math.min(n, i);
        return data;
    }

    // Number of interpolated frame each year
    let k = 10;
    let keyframes = [];
    let ka, a, kb, b;
    for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
        for (let i = 0; i < k; i++) {
            const t = i / k;
            keyframes.push([
                new Date(ka * (1 - t) + kb * t),
                rank(country => (a.get(country) || 0) * (1 - t) + (b.get(country) || 0) * t)
            ]);
        }
    }

    let nameframes = d3.groups(keyframes.flatMap(([, data]) => data), d => d.country);
    let prev = new Map(nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])));
    let next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)));

    let margin = {top: 16, right: 150, bottom: 6, left: 0};
    let barSize = 48;
    let x = d3.scaleLinear([0, 1], [margin.left, width - margin.right]);
    let y = d3.scaleBand()
          .domain(d3.range(n + 1))
          .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
          .padding(0.1);

    function bars(svg) {
        let bar = svg.append("g")
                      .attr("fill-opacity", 1.0)
                  .selectAll("rect");

        return ([date, data], transition) => bar = bar
            .data(data.slice(0, n), d => d.country)
            .join(
                enter => enter.append("rect")
                          .attr("fill", color)
                          .attr("height", y.bandwidth())
                          .attr("x", x(0))
                          .attr("y", d => y((prev.get(d) || d).rank))
                          .attr("width", d => x((prev.get(d) || d).value) - x(0)),
                update => update,
                exit => exit.transition(transition).remove()
                          .attr("y", d => y((next.get(d) || d).rank))
                          .attr("width", d => x((next.get(d) || d).value) - x(0))
            )
            .call(bar => bar.transition(transition)
                          .attr("y", d => y(d.rank))
                          .attr("width", d => x(d.value) - x(0)));
    }

    function labels(svg) {
        let locale = d3.formatLocale({
            thousands: " ",
            grouping: [3],
        });
        let formatNumber = locale.format(",d");
        let label = svg.append("g")
                      .style("font-family", font_sans_serif)
                      .style("font-weight", "bold")
                      .style("font-variant-numeric", "tabular-nums")
                      .attr("fill", "currentColor")
                      .attr("text-anchor", "start")
                    .selectAll("text");

        return ([date, data], transition) => label = label
            .data(data.slice(0, n), d => d.country)
            .join(
                enter => enter.append("text")
                    .attr("transform", d => `translate(${x((prev.get(d) || d).value)},${y((prev.get(d) || d).rank)})`)
                    .attr("y", y.bandwidth() / 2)
                    .attr("x", 6)
                    .attr("dy", "-0.25em")
                    //.text(d => `${country_info[d.country][0]} ${country_info[d.country][1] || d.country}`)
                    .text(d => `${country_info[d.country][0]} ${d.country}`)
                    .attr("font-size", 17.0)
                    .call(text => text.append("tspan")
                        .attr("fill-opacity", 0.9)
                        .attr("font-size", 13.0)
                        .attr("font-weight", "normal")
                        .attr("x", 6)
                        .attr("dy", "1.15em")),
                update => update,
                exit => exit.transition(transition).remove()
                    .attr("transform", d => `translate(${x((next.get(d) || d).value)},${y((next.get(d) || d).rank)})`)
                    .call(g => g.select("tspan")
                              .textTween((d) => d3.interpolateRound(d.value, (next.get(d) || d).value))
                     )
            )
            .call(bar => bar.transition(transition)
                .attr("transform", d => `translate(${x(d.value)},${y(d.rank)})`)
                .call(g => g.select("tspan")
                            .textTween((d) => (t) => formatNumber(
                                d3.interpolateNumber((prev.get(d) || d).value, d.value)(t)
                            ))
                )
            )
    }

    function axis(svg) {
        const g = svg.append("g")
            .attr("transform", `translate(0,${margin.top})`);

        const axis = d3.axisTop(x)
            .ticks(width / 280)
            .tickSizeOuter(0)
            .tickSizeInner(-barSize * (n + y.padding()));

        return (_, transition) => {
            g.transition(transition).call(axis);
            g.select(".tick:first-of-type text").remove();
            g.selectAll(".tick:not(:first-of-type) line")
                .attr("stroke", "currentColor")
                .attr("opacity", 0.2);
            g.select(".domain").remove();
        };
    }

    function ticker(svg) {
        let formatDate = d3.utcFormat("%Y");
        const now = svg.append("text")
            .style("font-family", font_sans_serif)
            .style("font-weight", "bold")
            .style("font-size", `${barSize}px`)
            .style("font-variant-numeric", "tabular-nums")
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .attr("x", width - 6)
            .attr("y", margin.top + barSize * (n/2 + 0.45))
            .attr("dy", "0.32em")
            .text(formatDate(keyframes[0][0]));

        return ([date], transition) => {
            transition.end().then(() => now.text(formatDate(date)));
        };
    }

    let color;
    const scale = d3.scaleOrdinal(d3.schemeTableau10);
    if (data_orig.some(d => d.region !== undefined)) {
        const categoryByName = new Map(data_orig.map(d => [d.country, d.region]))
        scale.domain(Array.from(categoryByName.values()));
        color = d => scale(categoryByName.get(d.country));
    } else {
        color = d => scale(d.country);
    }

    const start = async function() {
        const svg = d3.select(dom_id)
            .append("svg")
            .attr("width", width)
            .attr("height", barSize * n * 1.05)
            .style("color", "currentColor");

        const updateBars = bars(svg);
        const updateAxis = axis(svg);
        const updateLabels = labels(svg);
        const updateTicker = ticker(svg);

        let duration = 250;
        for (const keyframe of keyframes) {
            const transition = svg.transition()
                .duration(duration)
                .ease(d3.easeLinear);

            // Extract the top bar’s value.
            x.domain([0, keyframe[1][0].value]);

            updateTicker(keyframe, transition);
            updateAxis(keyframe, transition);
            updateBars(keyframe, transition);
            updateLabels(keyframe, transition);

            await transition.end();
        }
    };
    start();
}

let preprocess = function(datum) {
    const timeParse = d3.timeParse("%Y-%m-%d");
    datum.date = timeParse(datum.date);
    datum.value = +datum.value / 1000000;
    return datum;
};

d3.csv("/assets/data/vn_export_by_countries.csv", preprocess).then(data => draw_chart(data, "#chart_export"));
d3.csv("/assets/data/vn_import_by_countries.csv", preprocess).then(data => draw_chart(data, "#chart_import"));

