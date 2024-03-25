// set the dimensions and margins of the graph
// const margin = {
//         top: 10,
//         right: 30,
//         bottom: 30,
//         left: 60
//     },
//     height_main = 450,
//     height_mini = 100,
//     padding_x = 40,
//     padding_y = 30,
//     width_legend_col = 140,
//     width_legend = width_legend_col * 2,
//     width = 1560 - margin.left - margin.right,
//     width_main = width - width_legend - padding_x,
//     height = height_main + height_mini + padding_y - margin.top - margin.bottom;


const funds_info = [
    { 'name': 'VNINDEX',     'type': 'Index',                                    },
    { 'name': 'VN30',        'type': 'Index',                                    },
    { 'name': 'DCDS',        'type': 'Active',     'company': 'Dragon Capital',  },
    { 'name': 'DCDE',        'type': 'Active',     'company': 'Dragon Capital',  },
    { 'name': 'DCBF',        'type': 'Bond',       'company': 'Dragon Capital',  },
    { 'name': 'DCIP',        'type': 'Bond',       'company': 'Dragon Capital',  },
    { 'name': 'E1VFVN30',    'type': 'ETF',        'company': 'Dragon Capital',  },
    { 'name': 'FUEVFVND',    'type': 'ETF',        'company': 'Dragon Capital',  },
    { 'name': 'FUEDCMID',    'type': 'ETF',        'company': 'Dragon Capital',  },
    { 'name': 'TCEF',        'type': 'Active',     'company': 'Techcom Capital', },
    { 'name': 'TCBF',        'type': 'Bond',       'company': 'Techcom Capital', },
    { 'name': 'TCFF',        'type': 'Bond',       'company': 'Techcom Capital', },
    { 'name': 'TCFIN',       'type': 'Active',     'company': 'Techcom Capital', },
    { 'name': 'VCBF-MGF',    'type': 'Active',     'company': 'VCBF',            },
    { 'name': 'VCBF-TBF',    'type': 'Active',     'company': 'VCBF',            },
    { 'name': 'VCBF-BCF',    'type': 'Active',     'company': 'VCBF',            },
    { 'name': 'VCBF-FIF',    'type': 'Bond',       'company': 'VCBF',            },
    { 'name': 'VESAF',       'type': 'Active',     'company': 'VinaCapital',     },
    { 'name': 'VEOF',        'type': 'Active',     'company': 'VinaCapital',     },
    { 'name': 'VIBF',        'type': 'Active',     'company': 'VinaCapital',     },
    { 'name': 'VFF',         'type': 'Bond',       'company': 'VinaCapital',     },
    { 'name': 'VLBF',        'type': 'Bond',       'company': 'VinaCapital',     },
    { 'name': 'FUEVN100',    'type': 'ETF',        'company': 'VinaCapital',     },
    { 'name': 'SSI-SCA',     'type': 'Active',     'company': 'SSIAM',           },
    { 'name': 'SSIBF',       'type': 'Bond',       'company': 'SSIAM',           },
    { 'name': 'VLGF',        'type': 'Active',     'company': 'SSIAM',           },
    { 'name': 'FUESSV50',    'type': 'ETF',        'company': 'SSIAM',           },
    { 'name': 'FUESSVFL',    'type': 'ETF',        'company': 'SSIAM',           },
    { 'name': 'FUESSV30',    'type': 'ETF',        'company': 'SSIAM',           },
    { 'name': 'BVFED',       'type': 'Active',     'company': 'Baoviet Fund',    },
    { 'name': 'BVBF',        'type': 'Bond',       'company': 'Baoviet Fund',    },
    { 'name': 'BVPF',        'type': 'Active',     'company': 'Baoviet Fund',    },
    { 'name': 'ENF',         'type': 'Active',     'company': 'Eastspring',      },
    { 'name': 'VNDAF',       'type': 'Active',     'company': 'IPAAM',           },
    { 'name': 'VNDBF',       'type': 'Bond',       'company': 'IPAAM',           },
    { 'name': 'FUEIP100',    'type': 'ETF',        'company': 'IPAAM',           },
    { 'name': 'MAFEQI',      'type': 'Active',     'company': 'Manulife IM',     },
    { 'name': 'MAFBAL',      'type': 'Active',     'company': 'Manulife IM',     },
    { 'name': 'MBVF',        'type': 'Active',     'company': 'MB Capital',      },
    { 'name': 'MBBOND',      'type': 'Bond',       'company': 'MB Capital',      },
    { 'name': 'FUEMAV30',    'type': 'ETF',        'company': 'Mirae Asset',     },
    { 'name': 'FUEKIV30',    'type': 'ETF',        'company': 'KIM',             },
    { 'name': 'FUEKIVFS',    'type': 'ETF',        'company': 'KIM',             },
];

const fund_types = ['Index', 'ETF', 'Active', 'Bond'];
for (const t of fund_types) {
    funds_info[t] = funds_info.filter(f => f.type === t).map(f => f.name);
}

const n_cols_legend = 4;

const width_legend_col = 110,
    width_legend = width_legend_col * n_cols_legend;

const layout = new function() {
        this.margin = {
            top: 30,
            right: 30,
            bottom: 30,
            left: 60
        };
        // w: 1560,
        // h: 540,
        this.w = 1450;
        this.h = 520;
    },

    layout_top_line = new function() {
        this.margin = {
            right: 50,
            bottom: 10,
        };
        this.x = 0;
        this.y = 6;
        this.w = layout.w - this.margin.right - width_legend;
        this.h = 10;
    },

    layout_main_chart = new function() {
        this.margin = {
            right: 40,
            bottom: 30
        };
        this.x = 0;
        this.y = layout_top_line.h + layout_top_line.margin.bottom;
        this.w = layout_top_line.w;
        this.h = layout.h - 95;
    },
    layout_minimap = new function() {
        this.w = layout_main_chart.w;
        this.h = 50;
        this.x = 0;
        // y: layout.margin.top + layout_main_chart.h + layout_main_chart.margin.bottom,
        this.y = layout.h - this.h;
    },
    layout_legends = {
        x: layout_main_chart.w + layout_main_chart.margin.right,
        // y: layout.margin.top,
        // y: 30,
        y: 5,
        w: width_legend,
        h: layout.h,
    };

// Number of ticks on axis
const x_nticks = 6;
const y_nticks = 4;

const zoom_periods = [ "1M", "3M", "6M", "YTD", "1Y", "3Y", "5Y", "All" ];

const r_tooltips_item = 4;

//Read the data
let load_data = d3.csv("/assets/data/resampled/W-MON/combine_resampled_data.csv", function(data) {
    const timeParse = d3.timeParse("%Y-%m-%d");
    data.date = timeParse(data.Date);
    return data;
});
load_data.then(data => draw_chart(data, "#chart_cr", "cr"));

function draw_chart(data, dom_id, chart_name) {
    // Dark/light mode color palette
    let colors = {
        // background:          ["#222222", "#ffffff"],
        background:          ["#1b1b1e", "#ffffff"],
        text:                ["#fff", "#000"],
        button:              ["#1b1b1e", "#ECECEC"],
        button_hover:        ["#555", "#DADADA"],
        button_border:       ["#555", null],
        // selected_range_text: ["#8ab4f8", "#00559e"],
        selected_range_text: ["#fff", "#00559e"],
    };

    // Handle dark/light mode
    let light_mode = toggle.modeStatus === ModeToggle.LIGHT_MODE ? 1 : 0;

    d3.select("html").attr("data-theme", light_mode ? "light" : "dark");

    document.getElementById("mode-toggle-wrapper").addEventListener('click', function() {
        light_mode = +!light_mode;

        d3.select("html").attr("data-theme", light_mode ? "light" : "dark");

        svg.style("background-color", colors.background[light_mode])
            .style("color", colors.text[light_mode]);

        top_line.select("text")
            .attr("fill", colors.text[light_mode]);

        zoom_buttons
            .on("mouseover", function(e) {
                d3.select(this).select("rect")
                    .attr("fill", colors.button_hover[light_mode]);
            })
            .on("mouseleave", function(e) {
                d3.select(this).select("rect")
                    .attr("fill", colors.button[light_mode]);
            });

        zoom_buttons.select("rect")
            .attr("stroke", colors.button_border[light_mode])
            .attr("fill", colors.button[light_mode]);

        zoom_buttons.select("text")
            .attr("fill", colors.text[light_mode]);

        selected_range_text
            .attr("fill", colors.selected_range_text[light_mode]);

        g_legends.selectAll("text")
            .attr("fill", colors.text[light_mode]);

        g_legend_items.select("circle")
            .attr("stroke", d => {
                let i = selected_funds.indexOf(d.name);
                return (i < 0) ? colors.text[light_mode] : colorScales(i);
            })
            .attr("fill", d => {
                let i = selected_funds.indexOf(d.name);
                return (i < 0) ? colors.background[light_mode] : colorScales(i);
            });
    });

    //
    let main_paths_opacity = 0.75;

    let data_orig = data;
    const time_format = d3.timeFormat("%Y-%m-%d");
    let y_format = d3.format("-");
    let funds = data.columns.slice(1);

    // let selected_funds = funds;
    let selected_funds = JSON.parse(localStorage.getItem('selected_funds'));
    if (selected_funds === null)
        selected_funds = ["VNINDEX", "DCDS", "E1VFVN30", "TCEF", "VESAF"];
    let data_selected_funds_all;
    let highlighted_fund = null;

    // append the svg object to the body of the page
    const svg = d3.select(dom_id)
        .append("svg")
        .attr("width", layout.w + layout.margin.left + layout.margin.right)
        .attr("height", layout.h + layout.margin.top + layout.margin.bottom)
        .style("background-color", colors.background[light_mode])
        .style("color", colors.text[light_mode]);

    const svg_g = svg.append("g")
        .attr("transform", `translate(${layout.margin.left},${layout.margin.top})`);

    // Group data by fund
    function get_data_g() {
        switch(chart_name) {
        case "navps":
            return selected_funds.map(fund => ({
                fund: fund,
                info: d3.map(data, d => ({
                    date: d.date,
                    value: +d[fund],
                })),
            }));
        case "cr":
            return selected_funds.map(fund => ({
                fund: fund,
                info: d3.map(data, d => ({
                    date: d.date,
                    value: +d[fund] / +data[0][fund] - 1,
                })),
            }));
        }
    }

    // Prepare data
    switch (chart_name) {
    case "navps":
        break;
    case "cr":
        data = data.filter(d => {
            for (const fund of selected_funds) {
                if (+d[fund] === 0) {
                    return false;
                }
            }
            return true;
        })
        data_selected_funds_all = data;
        y_format = d3.format("+.0%");
        break;
    }

    let data_g = get_data_g()

    // let data_g_date = data.map(line => ({
    //     date: line.date,
    //     info: funds.map(fund => ({
    //         fund: fund,
    //         navps: +line[fund],
    //     })),
    // }));
    // console.log(data_g_date)


    // TOP LINE
    let top_line = svg_g.append("g")
        .classed("top-line", true)
        .attr("transform", `translate(${layout_top_line.x}, ${layout_top_line.y})`);

    top_line.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 13)
        .attr("text-anchor", "start")
        .attr("x", 17)
        .attr("fill", colors.text[light_mode])
        .text("Zoom");

    // Zoom buttons
    let zoom_buttons = top_line.selectAll(".zoom-button")
        .data(zoom_periods)
        .join("g")
        .classed("zoom-button", true)
        .attr("cursor", "pointer")
        .attr("transform", (d, i) => `translate(${60 + i * 40}, 0)`)
        .on("click", set_zoom)
        .on("mouseover", function(e) {
            d3.select(this).select("rect")
                .attr("fill", colors.button_hover[light_mode]);
        })
        .on("mouseleave", function(e) {
            d3.select(this).select("rect")
                .attr("fill", colors.button[light_mode]);
        });

    zoom_buttons.append("rect")
        .attr("rx", 10)
        .attr("width", 36)
        .attr("height", 21)
        .attr("stroke-width", 0.8)
        .attr("stroke", colors.button_border[light_mode])
        .attr("fill", colors.button[light_mode])
        .attr("x", 0)
        .attr("y", -15);

    zoom_buttons.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 13)
        .attr("text-anchor", "middle")
        .attr("fill", colors.text[light_mode])
        .style("user-select", "none")
        .attr("x", 18)
        .text(d => d);

    // Zoom buttons handler
    function set_zoom(e, d) {
        let domain = x_all.domain();
        switch(d) {
        case "All":
            selected_date = [ domain[0], domain[1] ];
            break;
        case "YTD":
            selected_date = [
                d3.max([
                    d3.utcYear.floor(domain[1]),
                    domain[0]
                ]),
                domain[1]
            ];
            break;
        default:
            let n = parseInt(d[0]);
            let interval;
            switch (d[1]) {
            case 'M':
                interval = d3.utcMonth;
                break;
            case 'Y':
                interval = d3.utcYear;
                break;
            }
            selected_date[0] = interval.offset(selected_date[1], -n);
            if (selected_date[0] < domain[0]) {
                // Desired start date is out of range, must expand desired end date
                selected_date[0] = domain[0];
                selected_date[1] = interval.offset(selected_date[0], n);
                if (selected_date[1] > domain[1]) {
                    // Desired end date is out of range too
                    selected_date[1] = domain[1];
                }
            }
            break;
        }
        let updated_selection = [ x_all(selected_date[0]), x_all(selected_date[1]) ];
        gb.transition()
            .duration(200)
            .call(brush.move, updated_selection);
    }

    // Selected time range info
    let selected_range_text = top_line.append("text")
        .classed("selected-range", true)
        .attr("font-family", "monospace")
        // .attr("font-family", "sans-serif")
        .attr("font-size", 14)
        .attr("text-anchor", "end")
        // .attr("fill", "#0069c2")
        .attr("fill", colors.selected_range_text[light_mode])
        .style("user-select", "none")
        .attr("x", layout_top_line.w)
        .attr("y", 0);


    // MAIN CHART
    let main_chart = svg_g.append("g")
        .classed("main-chart-area", true)
        .attr("transform", `translate(${layout_main_chart.x}, ${layout_main_chart.y})`);

    // x_all is x scale with domain is the whole data
    let x_all = d3.scaleUtc()
        .domain(d3.extent(data, d => d.date))
        .range([0, layout_main_chart.w]);

    // x is x scale with domain is minimap's selected range
    let x = x_all.copy();

    // Main chart X axis
    x_axis_main = (x_scale) => d3.axisBottom(x_scale).ticks(x_nticks).tickFormat(time_format);
    let main_axis_x = main_chart.append("g")
        .classed("main-axis-x", true)
        .attr("transform", `translate(${layout_main_chart.x}, ${layout_main_chart.h})`)
        .call(x_axis_main(x));

    // y scale for whole data_g
    const y = d3.scaleLinear()
        .domain([
            d3.min(data_g, d => d3.min(d.info, v => v.value)),
            d3.max(data_g, d => d3.max(d.info, v => v.value)) * 1.002,
        ])
        .range([layout_main_chart.h, 0]);

    // Main chart Y axis
    main_chart.append("g")
        .classed("main-axis-y", true)
        .call(d3.axisLeft(y).ticks(y_nticks).tickFormat(y_format));

    // Add mouse tracking line
    main_chart.append("path")
        .classed("mouse-line", true)
        .attr("d", `M0,${layout_main_chart.h} 0,0`)
        .attr("stroke", "#AAA")
        .attr("stroke-opacity", 0);

    // Clipping region for main chart
    // Main chart revealing animation on load
    main_chart.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("height", layout_main_chart.h)
        .attr("width", 0)
        .transition()
        .delay(400)
        .ease(d3.easeLinear)
        .duration(700)
        .attr("width", layout_main_chart.w);

    let line_generator = null;
    // Main chart path generator for lines
    if (chart_name === "navps")
        line_generator = (x_scale) => d3.line()
            .defined(d => !isNaN(d.value) && d.value !== 0)
            .x(d => x_scale(d.date))
            .y(d => y(d.value));
    else
        line_generator = (x_scale) => d3.line()
            .x(d => x_scale(d.date))
            .y(d => y(d.value));


    // Color scale
    let colorScales = d3.scaleSequential(d3.interpolateRainbow) 
            .domain([0, selected_funds.length]);

    // Add the line
    // let main_g = main_chart.append("g").selectAll(".g")
    //     .data(data_g)
    //     .enter()
    //     .append("g")
    //     .classed("g", true)

    // let main_paths = main_g.append("path")
    //     // .join("path")
    //     .attr("class", d => `main-chart-${d.fund}`)
    //     .attr("clip-path", "url(#clip)")
    //     .attr("fill", "none")
    //     .attr("stroke", (d, i) => colorScales(i))
    //     .attr("stroke-width", 1.5)
    //     .attr("d", d => line_generator(x)(d.info));

    let g = main_chart.append("g");
    // let main_paths = g.selectAll(".main-chart")
    //     .data(data_g)
    //     .join("path")
    //     .attr("class", d => `main-chart-${d.fund}`)
    //     .classed("main-chart", true)
    //     .attr("clip-path", "url(#clip)")
    //     .attr("fill", "none")
    //     .attr("stroke", (d, i) => colorScales(i))
    //     .attr("stroke-width", 2)
    //     .attr("d", d => line_generator(x)(d.info));

    // Group for each chart lines, contains chart line, crosshair
    let g_lines = g.selectAll(".g-line")
        .data(data_g)
        .join("g")
        .classed("g-line", true);

    // Add main chart lines
    let main_paths = g_lines.append("path")
        .attr("class", d => `main-chart-line-${d.fund}`)
        .classed("main-chart-line", true)
        .attr("clip-path", "url(#clip)")
        .attr("fill", "none")
        .attr("stroke", (d, i) => colorScales(i))
        .attr("stroke-width", 2)
        .attr("stroke-opacity", main_paths_opacity)
        .attr("d", d => line_generator(x)(d.info));


    // Old idea, now use clip path instead
    // Main chart revealing animation on load
    // main_chart.append("rect")
    //     .attr("width", layout_main_chart.w)
    //     .attr("height", layout_main_chart.h)
    //     .attr("fill", colors.background[dark_mode])
    //     .transition()
    //     .ease(d3.easeLinear)
    //     .duration(700)
    //     .attr("transform", `translate(${layout_main_chart.w}, 0)`)
    //     .delay(10)
    //     .remove();

    // Horizontal grid lines, added after revealing animation so the animation doesn't apply to these
    main_chart.append("g")
        .classed("grid-lines", true)
        .selectAll("line")
        .data(y.ticks(y_nticks))
        .join("line")
        .attr("stroke", "gray")
        .attr("stroke-opacity", 0.2)
        .attr("shape-rendering", "crispEdges")
        .attr("x1", layout_main_chart.x)
        .attr("x2", layout_main_chart.w)
        .attr("y1", d => y(d))
        .attr("y2", d => y(d))
    .filter(d => d === 0)
        .attr("stroke-opacity", 0.6);


    // CROSSHAIR AND TOOLTIPS
    // This allows to find the closest X index of the mouse:
    let bisect = d3.bisector(d => d.date).right;

    // Add mouse focus point on each main chart line
    let crosshairs = g_lines
        .append("circle")
        .attr("r", 3)
        .attr("fill", (d, i) => colorScales(i))
        .attr("stroke", (d, i) => colorScales(i))
        .attr("stroke-width", 2)
        .attr("opacity", 0);

    // Create tooltips
    let tooltips = main_chart.append("g")
        .classed("tooltips", true)
        .attr("opacity", 0);

    // Ugly hard-coded tooltips width, consider improvement in the future
    let tooltips_width = 240;

    // Tooltips bounding box
    let tooltips_box = tooltips.append("rect")
                    .attr("rx", 8)
                    .attr("width", tooltips_width)
                    .attr("height", 0)
                    .attr("stroke", "#358de1")
                    .attr("stroke-width", 1.9)
                    .attr("fill", "#F8F8F8")
                    .attr("opacity", 0.90);

    // Tooltips text group
    let tooltips_content = tooltips.append("g");
                                // .attr("font-family", "sans-serif")
                                // // .attr("font-family", "monospace")
                                // .attr("font-size", 12.5)
                                // .attr("text-anchor", "left");

    // Tooltips date line
    let tooltips_text_date = tooltips_content.append("text")
                                .attr("font-family", "sans-serif")
                                // .attr("font-family", "monospace")
                                .attr("font-size", 13.5)
                                .attr("font-weight", "bold")
                                .attr("text-anchor", "middle")
                                .style("user-select", "none")
                                .attr("x", tooltips_width / 2)
                                .attr("dy", "1.4em")
                                .text("date"); // text content should be set to something to ensure tooltips_content bounding box has correct height
    
    let tooltips_text_header = tooltips_content.append("text")
                                .attr("font-family", "sans-serif")
                                // .attr("font-family", "monospace")
                                .attr("font-size", 12.5)
                                .attr("font-style", "italic")
                                .style("user-select", "none")
                                .attr("dy", "2.9em")

    tooltips_text_header.append("tspan")
                .attr("x", tooltips_width - 85 + 15)
                .attr("text-anchor", "end")
                .text("Return")

    tooltips_text_header.append("tspan")
                .attr("x", tooltips_width - 24 + 15)
                .attr("text-anchor", "end")
                .text("CAGR")

    // Tooltips detail line for each fund
    let tooltips_lines_y = (d, i) => `translate(15, ${50 + i * 18})`;
    let tooltips_lines = tooltips_content.selectAll(".tooltips-line")
                .data(data_g)
                .join("g")
                .attr("class", d => `tooltips-line-${d.fund}`)
                .classed("tooltips-line", true)
                .attr("transform", tooltips_lines_y);

    tooltips_lines.append("circle")
        .attr("r", r_tooltips_item)
        .attr("stroke-width", 1)
        .attr("stroke", (d, i) => colorScales(i))
        .attr("fill", (d, i) => colorScales(i));

    let tooltips_text_lines = tooltips_lines.append("text")
                                .attr("font-family", "sans-serif")
                                // .attr("font-family", "monospace")
                                .attr("font-size", 12.5)
                                .attr("text-anchor", "left")
                                .style("user-select", "none")
                                .attr("x", 9)
                                .attr("y", 4);

    // Fund name, left aligned
    tooltips_text_lines.append("tspan")
                .classed("tooltips-name", true)
                .text(d => d.fund);

    // Fund value, right aligned
    let tooltips_text_navps = tooltips_text_lines.append("tspan")
                .classed("tooltips-navps", true)
                .attr("x", tooltips_width - 85)
                .attr("text-anchor", "end");

    let tooltips_text_cagr = tooltips_text_lines.append("tspan")
                .classed("tooltips-cagr", true)
                .attr("x", tooltips_width - 24)
                .attr("text-anchor", "end");

    tooltips_box.attr("height", tooltips_content.node().getBBox().height + 14);

    // Create a rect over main chart to captures mouse/touch events
    main_chart.append("rect")
        .attr("id", "rect-events")
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr("width", layout_main_chart.w)
        .attr("height", layout_main_chart.h)
        // .on("mouseover", mouseover_main)
        .on("mousemove", mousemove_main)
        .on("mouseout", mouseout_main)
        .on("touchstart", touchstart_main)
        .on("touchmove", mousemove_main)
        .on("touchcancel", mouseout_main);

    // touch screen event
    function touchstart_main(event) {
        event.preventDefault();
        // mouseover_main();
        mousemove_main(event);
    }

    function mouseover_main() {
        crosshairs.attr("opacity", 1);
        tooltips.attr("opacity", 1);
    }

    function mousemove_main(event) {
        // recover coordinate we need
        tooltips.attr("opacity", 1);
        let mouse_pos = d3.pointers(event)[0];
        let mouse_date = x.invert(mouse_pos[0]);
        let i = bisect(data, mouse_date);
        if (i >= data.length) {
            // out of range
            return;
        }

        let selected_data = data[i];
        let x_selected = x(selected_data.date);

        // vertical line to mark mouse x position
        main_chart.select(".mouse-line")
            .attr("transform", `translate(${x_selected},0)`)
            .attr("stroke-opacity", 1);
            // .attr("d", `M${x_selected},${height_main} ${x_selected},0`);
            //   return "translate(" + x(data[i].date) + "," + y(data[i].premium) + ")";

        crosshairs
            .attr("cx", d => x(d.info[i].date))
            .attr("cy", d => y(d.info[i].value))
            .attr("opacity", 1);

        let crosshair = d3.least(crosshairs, d => Math.abs(mouse_pos[1] - d3.select(d).attr("cy")));
        d3.select(crosshair).each(function(d) {
            if (Math.abs(mouse_pos[1] - d3.select(this).attr("cy")) < 10) {
                if (d.fund !== highlighted_fund) {
                    unhighlight_fund(highlighted_fund)
                    highlight_fund(d.fund)
                    highlighted_fund = d.fund;
                }
            } else {
                unhighlight_fund(highlighted_fund)
                highlighted_fund = null;
            }
        })

        tooltips_text_date
            .text(`${time_format(selected_date[0])} → ${time_format(selected_data.date)}`);

        tooltips_lines
            .sort((a, b) => b.info[i].value - a.info[i].value)
            .transition()
            .duration(40)
            .attr("transform", tooltips_lines_y)

        switch(chart_name) {
        case "navps":
            tooltips_text_navps
                .text(d => d.info[i].value.toFixed(2));
            break;
        case "cr":
            tooltips_text_navps
                .text(d => {
                    let tmp = d.info[i].value * 100;
                    return `${(tmp > 0) ? "+" : ""}${tmp.toFixed(2)}%`;
                });

            let range = selected_data.date - selected_date[0];
            let range_d = range / (1000 * 3600 * 24) + 1;
            let range_y1 = range_d / 365;
            let range_y = Math.floor(range_d / 365);
            let range_m = Math.floor((range_d - 365 * range_y) / 30);

            tooltips_text_date
                .text('('
                    + (range_y > 0 ? `${range_y}Y` : '')
                    + (range_m > 0 ? `${range_m}M` : '')
                    + ') '
                    + `${time_format(selected_date[0])} → ${time_format(selected_data.date)}`);

            tooltips_text_cagr
                .text(d => {
                    let cagr = Math.pow(d.info[i].value + 1, 1 / range_y1) - 1;
                    cagr *= 100;
                    return `${cagr.toFixed(2)}%`;
                });

            tooltips_text_cagr
                .attr("opacity", range_y1 < 3 ? 0.3 : 1);

            break;
        }

        if (x_selected < layout_main_chart.w - 15 - tooltips_width)
            tooltips.attr("transform", `translate(${x_selected + 15}, 0)`);
        else
            tooltips.attr("transform", `translate(${x_selected - tooltips_width - 15}, 0)`);
    }

    function mouseout_main() {
        if (highlighted_fund !== null)
            unhighlight_fund(highlighted_fund);

        crosshairs.attr("opacity", 0);
        tooltips.attr("opacity", 0);
        main_chart.select(".mouse-line")
            .attr("stroke-opacity", 0);
    }


    // MINIMAP
    // Default minimap selection
    // let selected_date_default = [d3.max([x_all(d3.utcYear.offset(x_all.domain()[1], -3)), x_all.range()[0]]), x_all.range()[1]];
    let selected_date = [ d3.max([ d3.utcYear.offset(x_all.domain()[1], -3), x_all.domain()[0] ]), x_all.domain()[1] ];
    let selection_default = [ x_all(selected_date[0]), x_all(selected_date[1]) ];

    // Minimap path generator
    let line_generator_mini = d3.line()
            .x(d => x(d.date))
            .y(d => y.copy().range([layout_minimap.h, 4])(d.value));

    // let minimap = svg.append("g").lower()
    let minimap = svg_g.insert("g", ".main-chart-area")
        .classed("minimap", true)
        .attr("transform", `translate(${layout_minimap.x}, ${layout_minimap.y})`);

    // Minimap X axis
    minimap.append("g")
        // .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
        .classed("minimap-axis-x", true)
        .call(d3.axisBottom(x).ticks(d3.utcYear))
        .attr("transform", `translate(${layout_minimap.x}, ${layout_minimap.h})`);

    // Add minimap chart lines
    minimap.append("g")
        .classed("minimap-paths", true)
        .selectAll("path")
        .data(data_g)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", (d, i) => colorScales(i))
        .attr("d", d => line_generator_mini(d.info));

    // Brush for minimap
    const brush = d3.brushX()
        .extent([[0, 0], [layout_main_chart.w, layout_minimap.h - 0]])
        .handleSize(12)
        .on("brush end", brushended);

    // function brushended({selection}) {
    //     if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    //     let s = d3.event.selection || x2.range();
    //     x.domain(s.map(x2.invert, x2));
    //     focus.select(".area").attr("d", area);
    //     focus.select(".axis--x").call(xAxis);
    //     svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
    //         .scale(width / (s[1] - s[0]))
    //         .translate(-s[0], 0));
    // }

    // function zoomed() {
    //     if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    //     var t = d3.event.transform;
    
    //     x.domain(t.rescaleX(x2).domain());
    //     focus.select(".area").attr("d", area);
    //     focus.select(".axis--x").call(xAxis);
    //     minimap.select(".brush").call(brush.move, x.range().map(t.invertX, t));
    // }

    function brushended({selection}) {
        // When move brush, call mouseout to remove tooltips
        mouseout_main();

        if (!selection) {
            selection = selection_default;
            gb.transition()
                .call(brush.move, selection_default);
        }
        // selection = selection || x.range();
        selected_date[0] = x_all.invert(selection[0]);
        selected_date[1] = x_all.invert(selection[1]);
        x.domain([ selected_date[0], selected_date[1] ]);

        // Calculate selected range, e.g. 1y3m or 5y7m
        let range = selected_date[1] - selected_date[0];
        let range_d = range / (1000 * 3600 * 24) + 1;
        let range_y = Math.floor(range_d / 365);
        let range_m = Math.floor((range_d - 365 * range_y) / 30);

        selected_range_text.text((range_y > 0 ? `${range_y}Y` : '')
                                + `${range_m}M: ${time_format(selected_date[0])} → ${time_format(selected_date[1])}`);

        switch(chart_name) {
        case "navps":
            main_paths.attr("d", d => line_generator(x)(d.info));

            main_chart.selectAll(".main-axis-x")
                .transition()
                .duration(0)
                .call(x_axis_main(x));
            break;
        case "cr":
            data = data_selected_funds_all.filter(d => (d.date >= selected_date[0]) && (d.date <= selected_date[1]))
            data_g = get_data_g();
            update_scale_y();
            update_main_chart_axis();
            update_main_chart_y_grids();
            update_main_chart();
            update_tooltips();
            break;
        }
    }

    // Move brush to default selection
    const gb = minimap.append("g")
        .classed("brush", true)
        .call(brush)
        .call(brush.move, selection_default);


    // LEGENDS
    // Add legends
    let height_legend = 28;
    let legends_per_col = Math.floor((layout_legends.h) / height_legend);

    let g_legends = svg_g.append("g")
        .classed("legends", true)
        .attr("transform", `translate(${layout_legends.x}, ${layout_legends.y})`);

    // Column header for type of fund
    g_legends.selectAll("text")
        .data(fund_types)
        .join("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)
        .attr("font-weight", "bold")
        .attr("text-anchor", "left")
        .attr("fill", colors.text[light_mode])
        .style("user-select", "none")
        .attr("transform", (d, i) => `translate(${i * width_legend_col - 6}, 0)`)
        .text(d => {
            switch (d) {
                case 'Active':
                    return "Active funds";
                case 'ETF':
                    return "Index funds";
                case 'Bond':
                    return "Fixed income";
                case 'Index':
                    return 'Indices';
            }
        });

    // Legend items for funds
    let g_legend_items = g_legends.selectAll(".legend-item")
        .data(funds_info)
        .join("g")
        .attr("class", d => `legend-item-${d.name}`)
        .classed("legend-item", true)
        .style("cursor", "pointer")
        // .attr("transform", (d, i) => {
        //     let col = Math.floor(i / legends_per_col);
        //     return `translate(${col * width_legend_col}, ${(i - col * legends_per_col) * height_legend})`;
        .attr("transform", (d, i) => {
            let col = fund_types.indexOf(d.type);
            let row = funds_info[d.type].indexOf(d.name);
            return `translate(${col * width_legend_col}, ${row * height_legend + 24})`;
        }).each(function(d) {
            this.enabled = false;
            if (selected_funds.includes(d.name))
                this.enabled = true;
        });

    // Legend inllustration with color
    let r = 6;
    g_legend_items.append("circle")
        .attr("r", r)
        .attr("stroke-width", 1)
        .attr("stroke", d => {
            let i = selected_funds.indexOf(d.name);
            return (i < 0) ? colors.text[light_mode] : colorScales(i);
        })
        .attr("fill", d => {
            let i = selected_funds.indexOf(d.name);
            return (i < 0) ? colors.background[light_mode] : colorScales(i);
        });

    // Legend text
    g_legend_items.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 13)
        .attr("text-anchor", "left")
        .attr("fill", colors.text[light_mode])
        .style("user-select", "none")
        .attr("x", r * 2)
        .attr("y", r / 2 + 1)
        .text(d => d.name);

    g_legend_items.append("title")
        .text(d => d.company);

    // Legend hover and click
    g_legend_items.on("mouseover", mouseover_legend)
            .on("mouseleave", mouseleave_legend)
            .on("click", onclick_legend);

    function highlight_fund(fund) {
        let already_highlighted = main_chart.select(".main-chart-line-highlight").empty()
        if (!already_highlighted)
            return;

        let selected_line = g_lines.select(`.main-chart-line-${fund}`)
        if (!selected_line.empty()) {
            // Highlight line of selected fund
            let clone = main_chart.node().insertBefore(selected_line.node().cloneNode(false), tooltips.node());
            // let clone = main_chart.node().appendChild(selected_line.node().cloneNode(false));
            d3.select(clone)
                .classed("main-chart-line-highlight", true)
                .style("pointer-events", "none")
                // .transition()
                // .duration(100)
                .attr("stroke-opacity", 1)
                .attr("stroke-width", 3)

            // Reduce opacity of other lines
            main_paths
                // .transition()
                // .duration(100)
                .attr("stroke-opacity", 0.3);
            // d3.select(this).select("text")
            //     .attr("font-weight", "bold");

            // Hightlight legend
            let legend = g_legends.select(`.legend-item-${fund}`);
            legend.select("circle")
                // .transition()
                // .duration(100)
                .attr("r", r + 2);
            legend.select("text")
                .attr("font-weight", "bold");

            // Highlight tooltips
            let l = tooltips_content.select(`.tooltips-line-${fund}`);
            l.select("text")
                .attr("font-weight", "bold");
            l.select("circle")
                .attr("r", r_tooltips_item + 2)
        }
    }

    function unhighlight_fund(fund) {
        main_chart.selectAll(".main-chart-line-highlight")
            // .transition()
            // .duration(60)
            .remove();
        main_paths
            // .transition()
            // .duration(100)
            .attr("stroke-opacity", main_paths_opacity);
        let legend = g_legends.select(`.legend-item-${fund}`);
        legend.select("circle")
            // .transition()
            // .duration(100)
            .attr("r", r);
        legend.select("text")
            // .transition()
            // .duration(100)
            .attr("font-weight", "normal");
        let l = tooltips_content.select(`.tooltips-line-${fund}`);
        l.select("text")
            .attr("font-weight", "normal")
        l.select("circle")
            .attr("r", r_tooltips_item)
    }

    function mouseover_legend(e, d) {
        highlight_fund(d.name);
    }

    function mouseleave_legend(e, d) {
        unhighlight_fund(d.name);
    }

    function onclick_legend(e, d) {
        this.enabled = !this.enabled;
        switch(chart_name) {
        case "navps":
            // if (this.enabled) {
            //     d3.select(this).attr("opacity", 1);
            //     g_lines.select(`.main-chart-${d}`)
            //         .attr("opacity", 1);
            // } else {
            //     d3.select(this).attr("opacity", 0.2);
            //     g_lines.select(`.main-chart-${d}`)
            //         .attr("opacity", 0.1);
            // }
            if (this.enabled) {
                selected_funds.push(d.name);
                selected_funds = funds.filter(fund => selected_funds.includes(fund));
            } else {
                selected_funds = selected_funds.filter(fund => fund !== d.name);
            }
            localStorage.setItem('selected_funds', JSON.stringify(selected_funds));
            data = data_orig.filter(d => {
                for (const fund of selected_funds) {
                    if (+d[fund] !== 0) {
                        return true;
                    }
                }
                return false;
            })
            data_selected_funds_all = data;
            update(data, selected_funds);
            break;
        case "cr":
            if (this.enabled) {
                selected_funds.push(d.name);
                selected_funds = funds.filter(fund => selected_funds.includes(fund));
            } else {
                selected_funds = selected_funds.filter(fund => fund !== d.name);
            }
            localStorage.setItem('selected_funds', JSON.stringify(selected_funds));
            data = data_orig.filter(d => {
                for (const fund of selected_funds) {
                    if (+d[fund] === 0) {
                        return false;
                    }
                }
                return true;
            })
            data_selected_funds_all = data;
            update(data, selected_funds);
            break;
        }
        if (this.enabled) {
            mouseover_legend.call(this, e, d);
        } else {
            mouseleave_legend.call(this, e, d);
        }
    }

    // Update y scale
    function update_scale_y() {
        y.domain([
            d3.min(data_g, d => d3.min(d.info, v => v.value)),
            d3.max(data_g, d => d3.max(d.info, v => v.value)) * 1.002,
        ]);
    }

    // Update axis
    function update_main_chart_axis() {
        main_chart.selectAll(".main-axis-x")
            .transition()
            .duration(40)
            .call(x_axis_main(x));

        main_chart.selectAll(".main-axis-y")
            .transition()
            .duration(40)
            .call(d3.axisLeft(y).ticks(y_nticks).tickFormat(y_format));
    }

    // Update y grids
    function update_main_chart_y_grids() {
        main_chart.select(".grid-lines")
            .selectAll("line")
            .data(y.ticks(y_nticks))
            .join("line")
            .attr("stroke", "gray")
            .attr("stroke-opacity", 0.2)
            .attr("shape-rendering", "crispEdges")
            .attr("x1", 0)
            .attr("x2", layout_main_chart.w)
            .attr("y1", d => y(d))
            .attr("y2", d => y(d))
        .filter(d => d === 0)
            .attr("stroke-opacity", 0.6);
    }

    // Update main chart
    function update_main_chart() {
        g_lines.data(data_g)
            .join(
                enter => {
                    let g_new = enter.append("g")
                        .classed("g-line", true);
                    g_new.append("path")
                        .attr("class", d => `main-chart-line-${d.fund}`)
                        .classed("main-chart-line", true)
                        .attr("clip-path", "url(#clip)")
                        .attr("fill", "none")
                        .attr("stroke-width", 2)
                        .attr("stroke-opacity", main_paths_opacity)
                        .attr("stroke", (d, i) => colorScales(i))
                        .attr("d", d => line_generator(x)(d.info));
                    g_new.append("circle")
                        .attr("r", 3)
                        .attr("fill", (d, i) => colorScales(i))
                        .attr("stroke", (d, i) => colorScales(i))
                        .attr("stroke-width", 2)
                        .attr("opacity", 0);
                },
                update => {
                    update.select(".main-chart-line")
                        .attr("class", d => `main-chart-line-${d.fund}`)
                        .classed("main-chart-line", true)
                        .attr("stroke", (d, i) => colorScales(i))
                        .attr("d", d => line_generator(x)(d.info));
                    update.select("circle")
                        .attr("fill", (d, i) => colorScales(i))
                        .attr("stroke", (d, i) => colorScales(i));
                }
            );

        g_lines = g.selectAll(".g-line");
        main_paths = g_lines.select(".main-chart-line");
        crosshairs = g_lines.select("circle");
    }

    // Update minimap
    function update_minimap() {
        line_generator_mini = d3.line()
                .x(d => x_all(d.date))
                .y(d => y.copy().range([layout_minimap.h, 4])(d.value));

        minimap.select(".minimap-axis-x")
            .transition()
            .call(d3.axisBottom(x_all).ticks(d3.utcYear));

        minimap.select(".minimap-paths").selectAll("path")
            .data(data_g)
            .join("path")
            .attr("fill", "none")
            .attr("stroke", (d, i) => colorScales(i))
            .attr("d", d => line_generator_mini(d.info));
    }

    // Update tooltips
    function update_tooltips() {
        tooltips_lines.data(data_g)
            .join(
                enter => {
                    let g_new = enter.append("g")
                                    .attr("class", d => `tooltips-line-${d.fund}`)
                                    .classed("tooltips-line", true);
                    g_new.append("circle")
                        .attr("r", r_tooltips_item)
                        .attr("stroke-width", 1)
                        .attr("stroke", (d, i) => colorScales(i))
                        .attr("fill", (d, i) => colorScales(i));
                    let t_new = g_new.append("text")
                                .attr("font-family", "sans-serif")
                                // .attr("font-family", "monospace")
                                .attr("font-size", 12.5)
                                .attr("text-anchor", "left")
                                .attr("x", 9)
                                .attr("y", 4);

                    t_new.append("tspan")
                        .classed("tooltips-name", true)
                        .text(d => d.fund);

                    t_new.append("tspan")
                        .classed("tooltips-navps", true)
                        .attr("x", tooltips_width - 85)
                        .attr("text-anchor", "end");

                    t_new.append("tspan")
                        .classed("tooltips-cagr", true)
                        .attr("x", tooltips_width - 24)
                        .attr("text-anchor", "end");
                },
                update => {
                    update.attr("class", d => `tooltips-line-${d.fund}`)
                        .classed("tooltips-line", true);
                    update.select("circle")
                        .attr("stroke", (d, i) => colorScales(i))
                        .attr("fill", (d, i) => colorScales(i));
                    update.select("text").select(".tooltips-name")
                        .text(d => d.fund);
                }
            );

        tooltips_lines = tooltips_content.selectAll(".tooltips-line")
                            .attr("transform", tooltips_lines_y);
        tooltips_text_navps = tooltips_lines.select("text").select(".tooltips-navps");
        tooltips_text_cagr = tooltips_lines.select("text").select(".tooltips-cagr");
        tooltips_box.attr("height", tooltips_content.node().getBBox().height + 14);

    }

    function update_legends() {
        g_legend_items.selectAll("circle")
            .attr("stroke", d => {
                let i = selected_funds.indexOf(d.name);
                return (i < 0) ? colors.text[light_mode] : colorScales(i);
            })
            .attr("fill", d => {
                let i = selected_funds.indexOf(d.name);
                return (i < 0) ? colors.background[light_mode] : colorScales(i);
            });
    }

    // Completely update whole chart with new data
    function update(data, selected_funds) {
        data_g = get_data_g();

        // Update colors for selected funds
        colorScales.domain([0, selected_funds.length]);

        x_all.domain(d3.extent(data, d => d.date));
        x = x_all.copy();

        update_scale_y();
        update_main_chart_axis();
        update_main_chart_y_grids();
        update_main_chart();

        update_minimap();
        // Default selected range is the same but x scale changed, so it must be updated
        selection_default = [d3.max([x_all(d3.utcYear.offset(x.domain()[1], -3)), x_all.range()[0]]), x_all.range()[1]];

        // Current selection needs to be updated too
        selected_date = [
            // TODO: this needs to be improved
            d3.max([
                // d3.utcYear.offset(x_all.domain()[1], -3),
                x_all.domain()[0],
                selected_date[0]
            ]),
            x_all.domain()[1]
        ];
        let updated_selection = [ x_all(selected_date[0]), x_all(selected_date[1]) ];
        gb.call(brush.move, updated_selection);

        update_tooltips();
        update_legends();
    }
}

//Read the data
// d3.csv("../data/resampled_3d/combine_3d_data.csv",
//     function (data) {
//         const timeParse = d3.timeParse("%Y-%m-%d");
//         let cols = Object.keys(data).slice(1);
//         let data_ret = [];
//         cols.forEach(col => {
//             data_ret.push({ date: timeParse(data.Date), fund: col, value: +data[col] });
//         });
//         return data_ret;
//     }).then(
//     function (data) {
//         data = data.flat();
//         let main_chart = svg.append("g")
//             .classed("main_chart", true);

//         // Add X axis --> it is a date format
//         let x = d3.scaleUtc()
//             .domain(d3.extent(data, d => d.date))
//             .range([0, width]);
//         x_axis_main = (x_scale) => d3.axisBottom(x_scale).tickFormat(d3.timeFormat("%Y-%m-%d"));
//         main_chart.append("g")
//             .classed("main-axis-x", true)
//             .attr("transform", `translate(0, ${height_main})`)
//             .call(x_axis_main(x));

//         // Add Y axis
//         const y = d3.scaleLinear()
//             .domain(d3.extent(data, d => d.value))
//             .range([height_main, 0]);
//         main_chart.append("g")
//             .call(d3.axisLeft(y));

//         svg.append("defs")
//             .append("clipPath")
//             .attr("id", "clip")
//             .append("rect")
//             .attr("width", width)
//             .attr("height", height);

//         let line_generator = (x_scale) => d3.line()
//                 .x(d => x_scale(d.date))
//                 .y(d => y(d.value));

//         let data_g = d3.group(data, d => d.fund);
//         let funds = Array.from(data_g.keys());

//         let colorScales = d3.scaleSequential(d3.interpolateRainbow) 
//                 .domain([0, funds.length]);

//         // Add the line
//         let main_paths = main_chart.append("g").selectAll("path")
//             .data(data_g)
//             .join("path")
//             .attr("class", d => `main-chart-${d[0]}`)
//             .attr("clip-path", "url(#clip)")
//             .attr("fill", "none")
//             .attr("stroke", (d, i) => colorScales(i))
//             .attr("stroke-width", 1.5)
//             .attr("d", d => line_generator(x)(d[1]));

//         const defaultSelection = [x(d3.utcYear.offset(x.domain()[1], -3)), x.range()[1]];

//         let line_generator_mini = d3.line()
//                 .x(d => x(d.date))
//                 .y(d => y.copy().range([height_mini - margin.bottom, 4])(d.value))

//         let minimap = svg.append("g")
//             .classed("minimap", true)
//             .attr("transform", `translate(0,${height_main + padding})`);

//         minimap.append("g")
//             // .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
//             .call(d3.axisBottom(x).ticks(d3.utcYear))
//             .attr("transform", `translate(0, ${height_mini - margin.bottom})`);

//         minimap.append("g").selectAll("path")
//             .data(data_g)
//             .join("path")
//             .attr("fill", "none")
//             .attr("stroke", (d, i) => colorScales(i))
//             .attr("d", d => line_generator_mini(d[1]));

//         const brush = d3.brushX()
//             .extent([[0, 0], [width, height_mini - margin.bottom - 1]])
//             .on("end", brushended);

//         const gb = minimap.append("g")
//             .call(brush)
//             .call(brush.move, defaultSelection);

//         function brushended({selection}) {
//             if (!selection) {
//                 selection = defaultSelection;
//                 gb.call(brush.move, defaultSelection);
//             }
//             // selection = selection || x.range();
//             width_selection = selection[1] - selection[0];
//             let x_new = d3.scaleUtc()
//                 .domain([ x.invert(selection[0]), x.invert(selection[1]) ])
//                 .range([0, width]);
//             // main_chart.select(`.main-chart`)
//             main_paths.transition()
//                 .duration(150)
//                 .attr("d", d => line_generator(x_new)(d[1]));
//             main_chart.select(".main-axis-x")
//                 .transition()
//                 .duration(150)
//                 .call(x_axis_main(x_new));
//         }

//         /*
//         // This allows to find the closest X index of the mouse:
//         var bisect = d3.bisector(function (d) {
//             return d.date;
//         }).left;

//         // Create the circle that travels along the curve of chart
//         var focus = svg
//             .append('g')
//             .append('circle')
//             .style("fill", "none")
//             .attr("stroke", "black")
//             .attr('r', 8.5)
//             .style("opacity", 0)

//         // Create the text that travels along the curve of chart
//         var focusText = svg
//             .append('g')
//             .append('text')
//             .style("opacity", 0)
//             .attr("text-anchor", "left")
//             .attr("alignment-baseline", "middle")


//         // Create a rect on top of the svg area: this rectangle recovers mouse position
//         svg
//             .append('rect')
//             .style("fill", "none")
//             .style("pointer-events", "all")
//             .attr('width', width)
//             .attr('height', height)
//             .on('mouseover', mouseover)
//             .on('mousemove', mousemove)
//             .on('mouseout', mouseout);

//         // What happens when the mouse move -> show the annotations at the right positions.
//         function mouseover() {
//             focus.style("opacity", 1)
//             focusText.style("opacity", 1)
//         }

//         function mousemove(event) {
//             // recover coordinate we need
//             var x0 = x.invert(d3.pointer(event)[0]);
//             var i = bisect(data, x0, 1);
//             selectedData = data[i]
//             focus
//                 .attr("cx", x(selectedData.date))
//                 .attr("cy", y(selectedData.value))
//             focusText
//                 .html("x:" + selectedData.date.toISOString().split("T")[0] + "  -  " + "y:" + selectedData.value)
//                 .attr("x", x(selectedData.date) + 15)
//                 .attr("y", y(selectedData.value))
//         }

//         function mouseout() {
//             focus.style("opacity", 0)
//             focusText.style("opacity", 0)
//         }
//         */
//     }
// );



// //Read the data
// d3.csv("../data/resampled_3d/combine_3d_data.csv",
//     function (data) {
//         const timeParse = d3.timeParse("%Y-%m-%d");
//         data.date = timeParse(data.Date);
//         return data;
//     }).then(
//     function (data) {
//         let cols = data.columns.slice(1);
//         let main_chart = svg.append("g")
//             .classed("main_chart", true);

//         // Add X axis --> it is a date format
//         let x = d3.scaleUtc()
//             .domain(d3.extent(data, d => d.date))
//             .range([0, width]);
//         x_axis_main = (x_scale) => d3.axisBottom(x_scale).tickFormat(d3.timeFormat("%Y-%m-%d"));
//         main_chart.append("g")
//             .classed("main-axis-x", true)
//             .attr("transform", `translate(0, ${height_main})`)
//             .call(x_axis_main(x));

//         // Add Y axis
//         const y = d3.scaleLinear()
//             .domain(d3.extent(((data, cols) => {
//                 let data_merge = [];
//                 cols.forEach(col => {
//                     data_merge.push(data.map(d => +d[col]));
//                 });
//                 return data_merge.flat();
//             })(data, cols)))
//             .range([height_main, 0]);
//         main_chart.append("g")
//             .call(d3.axisLeft(y));

//         svg.append("defs")
//             .append("clipPath")
//             .attr("id", "clip")
//             .append("rect")
//             .attr("width", width)
//             .attr("height", height);

//         let line_generator = (x_scale, col) => d3.line()
//                 .x(d => x_scale(d.date))
//                 .y(d => y(d[col]));

//         let colorScales = d3.scaleSequential(d3.interpolateRainbow) 
//                 .domain([0, cols.length-1]);

//         // Add the line
//         cols.forEach((col, i) => {
//             main_chart.append("path")
//                 .datum(data)
//                 .classed("main-chart", true)
//                 .classed(`main-chart-${col}`, true)
//                 .attr("clip-path", "url(#clip)")
//                 .attr("fill", "none")
//                 // .attr("stroke", "steelblue")
//                 .attr("stroke", colorScales(i))
//                 .attr("stroke-width", 1.5)
//                 .attr("d", line_generator(x, col));
//         });

//         const defaultSelection = [x(d3.utcYear.offset(x.domain()[1], -3)), x.range()[1]];

//         let minimap = svg.append("g")
//             .classed("minimap", true)
//             .attr("transform", `translate(0,${height_main + padding})`);

//         minimap.append("g")
//             // .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
//             .call(d3.axisBottom(x).ticks(d3.utcYear))
//             .attr("transform", `translate(0, ${height_mini - margin.bottom})`);

//         cols.forEach((col, i) => {
//             minimap.append("path")
//                 .datum(data)
//                 .attr("fill", "none")
//                 .attr("stroke", colorScales(i))
//                 .attr("d", d3.line()
//                     .x(d => x(d.date))
//                     // .y(d => y.copy().range([height_mini - margin.bottom, 4])(d.value))
//                     .y(d => y.copy().range([height_mini - margin.bottom, 4])(d[col]))
//                 );
//         });

//         const brush = d3.brushX()
//             .extent([[0, 0], [width, height_mini - margin.bottom - 1]])
//             .on("end", brushended);

//         const gb = minimap.append("g")
//             .call(brush)
//             .call(brush.move, defaultSelection);

//         // function brushed({selection}) {
//         //     if (selection) {
//         //         minimap.property("value", selection.map(x.invert, x).map(d3.utcDay.round));
//         //         minimap.dispatch("input");
//         //     }
//         // }

//         function brushended({selection}) {
//             if (!selection) {
//                 selection = defaultSelection;
//                 gb.call(brush.move, defaultSelection);
//             }
//             // selection = selection || x.range();
//             width_selection = selection[1] - selection[0];
//             let x_new = d3.scaleUtc()
//                 .domain([ x.invert(selection[0]), x.invert(selection[1]) ])
//                 .range([0, width]);
//             cols.forEach(col => {
//                 main_chart.select(`.main-chart-${col}`)
//                     .transition()
//                     // .attr("d", line_generator(x_new));
//                     .attr("d", line_generator(x_new, col));
//             });
//             main_chart.select(".main-axis-x")
//                 .transition()
//                 .call(x_axis_main(x_new));
//         }

//         /*
//         // This allows to find the closest X index of the mouse:
//         var bisect = d3.bisector(function (d) {
//             return d.date;
//         }).left;

//         // Create the circle that travels along the curve of chart
//         var focus = svg
//             .append('g')
//             .append('circle')
//             .style("fill", "none")
//             .attr("stroke", "black")
//             .attr('r', 8.5)
//             .style("opacity", 0)

//         // Create the text that travels along the curve of chart
//         var focusText = svg
//             .append('g')
//             .append('text')
//             .style("opacity", 0)
//             .attr("text-anchor", "left")
//             .attr("alignment-baseline", "middle")


//         // Create a rect on top of the svg area: this rectangle recovers mouse position
//         svg
//             .append('rect')
//             .style("fill", "none")
//             .style("pointer-events", "all")
//             .attr('width', width)
//             .attr('height', height)
//             .on('mouseover', mouseover)
//             .on('mousemove', mousemove)
//             .on('mouseout', mouseout);

//         // What happens when the mouse move -> show the annotations at the right positions.
//         function mouseover() {
//             focus.style("opacity", 1)
//             focusText.style("opacity", 1)
//         }

//         function mousemove(event) {
//             // recover coordinate we need
//             var x0 = x.invert(d3.pointer(event)[0]);
//             var i = bisect(data, x0, 1);
//             selectedData = data[i]
//             focus
//                 .attr("cx", x(selectedData.date))
//                 .attr("cy", y(selectedData.value))
//             focusText
//                 .html("x:" + selectedData.date.toISOString().split("T")[0] + "  -  " + "y:" + selectedData.value)
//                 .attr("x", x(selectedData.date) + 15)
//                 .attr("y", y(selectedData.value))
//         }

//         function mouseout() {
//             focus.style("opacity", 0)
//             focusText.style("opacity", 0)
//         }
//         */
//     }
// );

// let fund_list = ["DCDS", "DCBC"];

// function preprocess(data) {
//     const timeParse = d3.timeParse("%Y-%m-%d");
//     return {
//         date: timeParse(data.Date),
//         value: data.value,
//     };
// }

// let promise_list = [];
// fund_list.forEach((fund) => {
//     promise_list.push(d3.csv(`../data/${fund}_data.csv`, preprocess));
// });

// Promise.all(promise_list).then(

//     function (data) {
//         let main_chart = svg.append("g")
//             .classed("main_chart", true);

//         // Add X axis --> it is a date format
//         let x = d3.scaleUtc()
//             .domain(d3.extent(data, d => d.date))
//             .range([0, width]);
//         x_axis_main = (x_scale) => d3.axisBottom(x_scale).tickFormat(d3.timeFormat("%Y-%m"));
//         main_chart.append("g")
//             .classed("main-axis-x", true)
//             .attr("transform", `translate(0, ${height_main})`)
//             .call(x_axis_main(x));

//         // Add Y axis
//         const y = d3.scaleLinear()
//             .domain(d3.extent(data, d => +d.value))
//             .range([height_main, 0]);
//         main_chart.append("g")
//             .call(d3.axisLeft(y));

//         svg.append("defs")
//             .append("clipPath")
//             .attr("id", "clip")
//             .append("rect")
//             .attr("width", width)
//             .attr("height", height);

//         let line_generator = (x_scale) => d3.line()
//                 .x(d => x_scale(d.date))
//                 .y(d => y(d.value));

//         // Add the line
//         main_chart.append("path")
//             .datum(data)
//             .classed("main-chart", true)
//             .attr("clip-path", "url(#clip)")
//             .attr("fill", "none")
//             .attr("stroke", "steelblue")
//             .attr("stroke-width", 1.5)
//             .attr("d", line_generator(x));


//         const defaultSelection = [x(d3.utcYear.offset(x.domain()[1], -3)), x.range()[1]];

//         let minimap = svg.append("g")
//             .classed("minimap", true)
//             .attr("transform", `translate(0,${height_main + padding})`);

//         minimap.append("g")
//             // .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
//             .call(d3.axisBottom(x).ticks(d3.utcYear))
//             .attr("transform", `translate(0, ${height_mini - margin.bottom})`);

//         minimap.append("path")
//             .datum(data)
//             .attr("fill", "none")
//             .attr("stroke", "steelblue")
//             .attr("d", d3.line()
//                 .x(d => x(d.date))
//                 .y(d => y.copy().range([height_mini - margin.bottom, 4])(d.value))
//             );

//         const brush = d3.brushX()
//             .extent([[0, 0], [width, height_mini - margin.bottom - 1]])
//             .on("end", brushended);

//         const gb = minimap.append("g")
//             .call(brush)
//             .call(brush.move, defaultSelection);

//         function brushended({selection}) {
//             if (!selection) {
//                 selection = defaultSelection;
//                 gb.call(brush.move, defaultSelection);
//             }
//             width_selection = selection[1] - selection[0];
//             let x_new = d3.scaleUtc()
//                 .domain([ x.invert(selection[0]), x.invert(selection[1]) ])
//                 .range([0, width]);
//             main_chart.select(".main-chart")
//                 .transition()
//                 .attr("d", line_generator(x_new));
//             main_chart.select(".main-axis-x")
//                 .transition()
//                 .call(x_axis_main(x_new));
//         }
//     }
// );
