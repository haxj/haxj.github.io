import * as d3 from 'd3';

// Funds information
const funds_info = [
    { 'name': 'VNINDEX',     'type': 'Index',      'company': 'HOSE',            },
    { 'name': 'VN30',        'type': 'Index',      'company': 'HOSE',            },
    { 'name': 'E1VFVN30',    'type': 'ETF',        'company': 'VN30',            },
    { 'name': 'FUESSV30',    'type': 'ETF',        'company': 'VN30',            },
    { 'name': 'FUEMAV30',    'type': 'ETF',        'company': 'VN30',            },
    { 'name': 'FUEKIV30',    'type': 'ETF',        'company': 'VN30',            },
    { 'name': 'FUEVN100',    'type': 'ETF',        'company': 'VN100',           },
    { 'name': 'FUEIP100',    'type': 'ETF',        'company': 'VN100',           },
    { 'name': 'FUESSV50',    'type': 'ETF',        'company': 'VNX50',           },
    { 'name': 'FUEFCV50',    'type': 'ETF',        'company': 'VNX50',           },
    { 'name': 'FUEVFVND',    'type': 'ETF',        'company': 'VNDIAMOND',       },
    { 'name': 'FUEMAVND',    'type': 'ETF',        'company': 'VNDIAMOND',       },
    { 'name': 'FUEKIVND',    'type': 'ETF',        'company': 'VNDIAMOND',       },
    { 'name': 'FUESSVFL',    'type': 'ETF',        'company': 'VNFINLEAD',       },
    { 'name': 'FUEKIVFS',    'type': 'ETF',        'company': 'VNFINSELECT',     },
    { 'name': 'FUEDCMID',    'type': 'ETF',        'company': 'VNMIDCAP',        },
    { 'name': 'DCDS',        'type': 'Active',     'company': 'Dragon Capital',  },
    { 'name': 'DCDE',        'type': 'Active',     'company': 'Dragon Capital',  },
    { 'name': 'DCBF',        'type': 'Bond',       'company': 'Dragon Capital',  },
    { 'name': 'DCIP',        'type': 'Bond',       'company': 'Dragon Capital',  },
    { 'name': 'VESAF',       'type': 'Active',     'company': 'VinaCapital',     },
    { 'name': 'VEOF',        'type': 'Active',     'company': 'VinaCapital',     },
    { 'name': 'VIBF',        'type': 'Active',     'company': 'VinaCapital',     },
    { 'name': 'VMEEF',       'type': 'Active',     'company': 'VinaCapital',     },
    { 'name': 'VDEF',        'type': 'Active',     'company': 'VinaCapital',     },
    { 'name': 'VFF',         'type': 'Bond',       'company': 'VinaCapital',     },
    { 'name': 'VLBF',        'type': 'Bond',       'company': 'VinaCapital',     },
    { 'name': 'TCEF',        'type': 'Active',     'company': 'Techcom Capital', },
    { 'name': 'TCBF',        'type': 'Bond',       'company': 'Techcom Capital', },
    { 'name': 'TCFF',        'type': 'Bond',       'company': 'Techcom Capital', },
    { 'name': 'TCFIN',       'type': 'Active',     'company': 'Techcom Capital', },
    { 'name': 'TCRES',       'type': 'Active',     'company': 'Techcom Capital', },
    { 'name': 'TCSME',       'type': 'Active',     'company': 'Techcom Capital', },
    { 'name': 'SSI-SCA',     'type': 'Active',     'company': 'SSIAM',           },
    { 'name': 'SSIBF',       'type': 'Bond',       'company': 'SSIAM',           },
    { 'name': 'VLGF',        'type': 'Active',     'company': 'SSIAM',           },
    { 'name': 'VCBF-MGF',    'type': 'Active',     'company': 'VCBF',            },
    { 'name': 'VCBF-TBF',    'type': 'Active',     'company': 'VCBF',            },
    { 'name': 'VCBF-BCF',    'type': 'Active',     'company': 'VCBF',            },
    { 'name': 'VCBF-FIF',    'type': 'Bond',       'company': 'VCBF',            },
    { 'name': 'BVFED',       'type': 'Active',     'company': 'Baoviet Fund',    },
    { 'name': 'BVBF',        'type': 'Bond',       'company': 'Baoviet Fund',    },
    { 'name': 'BVPF',        'type': 'Active',     'company': 'Baoviet Fund',    },
    { 'name': 'ENF',         'type': 'Active',     'company': 'Eastspring',      },
    { 'name': 'VNDAF',       'type': 'Active',     'company': 'IPAAM',           },
    { 'name': 'VNDBF',       'type': 'Bond',       'company': 'IPAAM',           },
    { 'name': 'VNDCF',       'type': 'Bond',       'company': 'IPAAM',           },
    { 'name': 'MAFEQI',      'type': 'Active',     'company': 'Manulife IM',     },
    { 'name': 'MAFBAL',      'type': 'Active',     'company': 'Manulife IM',     },
    { 'name': 'MBVF',        'type': 'Active',     'company': 'MB Capital',      },
    { 'name': 'MBBOND',      'type': 'Bond',       'company': 'MB Capital',      },
];

const fund_types = new Set(funds_info.map(f => f.type));
let funds_grouped = new Map();
for (const t of fund_types) {
    funds_grouped.set(t, d3.group(funds_info.filter(f => f.type === t), f => f.company));
}

const font_sans_serif = "'Open Sans', sans-serif";

//const mode_portrait = window.innerWidth / window.innerHeight < 1.4;
const mode_portrait = window.innerWidth < 1820;

const main_chart_width_max = 1450;
const main_content_width = d3.select("#chart_cr")
    .node()
    .getBoundingClientRect()
    .width;

const main_chart_margin_left = 40;
const main_chart_margin_right = 16;
const width_main_chart = Math.min(main_content_width - main_chart_margin_left - main_chart_margin_right, main_chart_width_max);

// Dimensions and margins of chart components
const layout_main_chart = new function() {
        this.margin = {
            top: 30,
            bottom: 0,
            left: main_chart_margin_left,
        };
        this.x = this.margin.left;
        this.y = this.margin.top;
        this.w = width_main_chart;
        this.h = mode_portrait ? 450 : 600;
    },

    layout_top_line = new function() {
        this.margin = {
            top: 6,
            bottom: 10,
            left: mode_portrait ? -main_chart_margin_left/2 : 17,
        };
        this.x = this.margin.left;
        this.y = this.margin.top;
        this.w = layout_main_chart.w - this.margin.left;
        this.h = mode_portrait ? 30 : 10;
    },

    layout_minimap = new function() {
        this.margin = {
            top: 24,
            bottom: 20,
        };
        this.w = layout_main_chart.w;
        this.h = 50;
        this.x = 0;
        this.y = layout_main_chart.h - this.h - this.margin.bottom;
    },

    layout_core_chart = new function() {
        this.margin = {
            left: 0,
        };
        this.x = this.margin.left;
        this.y = layout_top_line.y + layout_top_line.h + layout_top_line.margin.bottom;
        this.w = layout_main_chart.w;
        this.h = layout_main_chart.h
                - (layout_top_line.margin.top + layout_top_line.margin.bottom + layout_top_line.h)
                - (layout_minimap.margin.top + layout_minimap.margin.top + layout_minimap.h);
    },

    layout = new function() {
        this.margin = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        };
        this.w = layout_main_chart.x + layout_main_chart.w + this.margin.left;
        this.h = layout_main_chart.y + layout_main_chart.h + this.margin.top;
    };

// Size of legend color marker
const w_legend_marker = 10;

// Number of ticks on axis
const y_nticks = 3;
const x_nticks = function (range, d3_interval) {
    // Limit number of ticks to display on x axis, depends on chart width
    let n_ticks_thres = Math.floor(layout_main_chart.w / 100);
    if (range[1] < d3_interval.offset(range[0], n_ticks_thres))
        return d3_interval;
    else
        return n_ticks_thres;
}

const zoom_periods = [ "YTD", "1M", "3M", "6M", "1Y", "3Y", "5Y", "All" ];

//Read the data
let load_data = d3.csv("/assets/data/resampled/W-MON/combine_resampled_data.csv", function(data) {
    const timeParse = d3.timeParse("%Y-%m-%d");
    data.date = timeParse(data.Date);
    return data;
});
load_data.then(data => draw_chart(data, "#chart_cr", "cr"));

function draw_chart(data, dom_id, chart_name) {
    let core_paths_opacity = 0.75;

    let data_orig = data;
    const time_format = d3.timeFormat("%Y-%m-%d");
    const time_format_yymm = d3.timeFormat("%Y-%m");
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
        .style("color", "currentColor");

    const svg_g = svg.append("g")
        .attr("transform", `translate(${layout.margin.left}, ${layout.margin.top})`);
    const main_chart = svg_g.append("g")
        .classed("main-chart", true)
        .attr("transform", `translate(${layout_main_chart.x}, ${layout_main_chart.y})`);

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


    // TOP LINE
    let top_line = main_chart.append("g")
        .classed("top-line", true)
        .attr("transform", `translate(${layout_top_line.x}, ${layout_top_line.y})`);

    top_line.append("text")
        .attr("font-family", font_sans_serif)
        .attr("font-size", 13)
        .attr("text-anchor", "start")
        .attr("fill", "currentColor")
        .text("Zoom");

    // Zoom buttons
    let zoom_buttons = top_line.selectAll(".zoom-button")
        .data(zoom_periods)
        .join("g")
        .classed("zoom-button", true)
        .attr("cursor", "pointer")
        .attr("transform", (d, i) => `translate(${40 + i * 34}, 0)`)
        .on("click", set_zoom)
        .on("mouseover", function(e) {
            d3.select(this).select("rect")
                .attr("fill-opacity", 0.3);
        })
        .on("mouseleave", function(e) {
            d3.select(this).select("rect")
                .attr("fill-opacity", 0);
        });

    zoom_buttons.append("rect")
        .attr("rx", 9)
        .attr("width", 30)
        .attr("height", 18)
        .attr("stroke-width", 0.8)
        .attr("stroke", "currentColor")
        .attr("fill", "currentColor")
        .attr("fill-opacity", 0)
        .attr("x", 0)
        .attr("y", -14);

    zoom_buttons.append("text")
        .attr("font-family", font_sans_serif)
        .attr("font-size", 13)
        .attr("text-anchor", "middle")
        .attr("fill", "currentColor")
        .style("user-select", "none")
        .attr("x", 15)
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
        .attr("font-family", font_sans_serif)
        .attr("font-variant-numeric", "tabular-nums")
        .attr("font-size", 13)
        .attr("text-anchor", mode_portrait ? "start" : "end")
        // .attr("fill", "#0069c2")
        .attr("fill", "currentColor")
        .style("user-select", "none")
        .attr("transform", `translate(${mode_portrait ? 0 : layout_top_line.w}, ${mode_portrait ? 25 : 0})`);


    // CORE CHART
    let core_chart = main_chart.append("g")
        .classed("core-chart-area", true)
        .attr("transform", `translate(${layout_core_chart.x}, ${layout_core_chart.y})`);

    // x_all is x scale with domain is the whole data
    let x_all = d3.scaleUtc()
        .domain(d3.extent(data, d => d.date))
        .range([0, layout_core_chart.w]);

    // x is x scale with domain is minimap's selected range
    let x = x_all.copy();

    // Core chart X axis
    let x_axis_main = (x_scale) => d3.axisBottom(x_scale).ticks(x_nticks(x_scale.domain(), d3.utcMonth)).tickFormat(time_format_yymm);
    let core_axis_x = core_chart.append("g")
        .classed("core-axis-x", true)
        .attr("transform", `translate(${layout_core_chart.x}, ${layout_core_chart.h})`)
        .call(x_axis_main(x));

    // y scale for whole data_g
    const y = d3.scaleLinear()
        .domain([
            d3.min(data_g, d => d3.min(d.info, v => v.value)),
            d3.max(data_g, d => d3.max(d.info, v => v.value)) * 1.002,
        ])
        .range([layout_core_chart.h, 0]);

    // Core chart Y axis
    core_chart.append("g")
        .classed("core-axis-y", true)
        .call(d3.axisLeft(y).ticks(y_nticks).tickFormat(y_format));

    // Add mouse tracking line
    core_chart.append("path")
        .classed("mouse-line", true)
        .attr("d", `M0,${layout_core_chart.h} 0,0`)
        .attr("stroke", "#AAA")
        .attr("stroke-opacity", 0);

    // Clipping region for main chart
    // Core chart revealing animation on load
    core_chart.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("height", layout_core_chart.h)
        .attr("width", 0)
        .transition()
        .delay(400)
        .ease(d3.easeLinear)
        .duration(700)
        .attr("width", layout_core_chart.w);

    let line_generator = null;
    // Core chart path generator for lines
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

    let g = core_chart.append("g");

    // Group for each chart lines, contains chart line, crosshair
    let g_lines = g.selectAll(".g-line")
        .data(data_g)
        .join("g")
        .classed("g-line", true);

    // Add main chart lines
    let core_paths = g_lines.append("path")
        .attr("class", d => `core-chart-line-${d.fund}`)
        .classed("core-chart-line", true)
        .attr("clip-path", "url(#clip)")
        .attr("fill", "none")
        .attr("stroke", (d, i) => colorScales(i))
        .attr("stroke-width", 2)
        .attr("stroke-opacity", core_paths_opacity)
        .attr("d", d => line_generator(x)(d.info));


    // Horizontal grid lines, added after revealing animation so the animation doesn't apply to these
    core_chart.append("g")
        .classed("grid-lines", true)
        .selectAll("line")
        .data(y.ticks(y_nticks))
        .join("line")
        .attr("stroke", "gray")
        .attr("stroke-opacity", 0.1)
        .attr("shape-rendering", "crispEdges")
        .attr("x1", layout_core_chart.x)
        .attr("x2", layout_core_chart.w)
        .attr("y1", d => y(d))
        .attr("y2", d => y(d))
    .filter(d => d === 0)
        .attr("stroke-opacity", 0.9);


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
    let tooltips = core_chart.append("g")
        .classed("tooltips", true)
        .attr("opacity", 0);

    // Ugly hard-coded tooltips width, consider improvement in the future
    let tooltips_width = 230;

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

    // Tooltips date line
    let tooltips_text_date = tooltips_content.append("text")
                                .attr("font-family", font_sans_serif)
                                // .attr("font-family", "monospace")
                                .attr("font-variant-numeric", "tabular-nums")
                                .attr("font-size", 13.0)
                                .attr("font-weight", "bold")
                                .attr("text-anchor", "middle")
                                .style("user-select", "none")
                                .attr("x", tooltips_width / 2)
                                .attr("dy", "1.4em")
                                .text("date"); // text content should be set to something to ensure tooltips_content bounding box has correct height

    let tooltips_text_header = tooltips_content.append("text")
                                .attr("font-family", font_sans_serif)
                                .attr("font-size", 12.0)
                                .attr("font-style", "italic")
                                .style("user-select", "none")
                                .attr("dy", "3.1em")

    tooltips_text_header.append("tspan")
                .attr("x", tooltips_width - 80 + 15)
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

    let r_tooltips_item = 4;

    tooltips_lines.append("circle")
        .attr("r", r_tooltips_item)
        .attr("stroke-width", 1)
        .attr("stroke", (d, i) => colorScales(i))
        .attr("fill", (d, i) => colorScales(i));

    let tooltips_text_lines = tooltips_lines.append("text")
                                .attr("font-family", font_sans_serif)
                                // .attr("font-family", "monospace")
                                .attr("font-variant-numeric", "tabular-nums")
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
                .attr("x", tooltips_width - 80)
                .attr("text-anchor", "end");

    let tooltips_text_cagr = tooltips_text_lines.append("tspan")
                .classed("tooltips-cagr", true)
                .attr("x", tooltips_width - 24)
                .attr("text-anchor", "end");

    tooltips_box.attr("height", tooltips_content.node().getBBox().height + 14);

    // Create a rect over main chart to captures mouse/touch events
    core_chart.append("rect")
        .attr("id", "rect-events")
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr("width", layout_core_chart.w)
        .attr("height", layout_core_chart.h)
        // .on("mouseover", mouseover_main)
        .on("mousemove", mousemove_main)
        .on("mouseout", mouseout_main)
        .on("touchstart", touchstart_main)
        .on("touchmove", mousemove_main)
        .on("touchend", mouseout_main)
        .on("touchcancel", mouseout_main);

    // touch screen event
    function touchstart_main(event) {
        if (event.cancelable)
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
        core_chart.select(".mouse-line")
            .attr("transform", `translate(${x_selected}, 0)`)
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
            .duration(60)
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

        if (x_selected + 10 < layout_core_chart.w - tooltips_width)
            tooltips.attr("transform", `translate(${x_selected + 10}, 0)`);
        else if (x_selected - tooltips_width - 10 > layout_core_chart.x + 10)
            tooltips.attr("transform", `translate(${x_selected - tooltips_width - 10}, 0)`);
        else
            tooltips.attr("transform", `translate(${layout_core_chart.x + 10}, 0)`);
    }

    function mouseout_main() {
        if (highlighted_fund !== null)
            unhighlight_fund(highlighted_fund);

        crosshairs.attr("opacity", 0);
        tooltips.attr("opacity", 0);
        core_chart.select(".mouse-line")
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
    let minimap = main_chart.insert("g", ".core-chart-area")
        .classed("minimap", true)
        .attr("transform", `translate(${layout_minimap.x}, ${layout_minimap.y})`);

    // Minimap X axis
    minimap.append("g")
        // .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
        .classed("minimap-axis-x", true)
        // .call(d3.axisBottom(x).ticks(d3.utcYear))
        .call(d3.axisBottom(x).ticks(x_nticks(x.domain(), d3.utcYear)))
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
        .extent([[0, 0], [layout_core_chart.w, layout_minimap.h - 0]])
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
            core_paths.attr("d", d => line_generator(x)(d.info));

            core_chart.selectAll(".core-axis-x")
                .transition()
                .duration(0)
                .call(x_axis_main(x));
            break;
        case "cr":
            data = data_selected_funds_all.filter(d => (d.date >= selected_date[0]) && (d.date <= selected_date[1]))
            data_g = get_data_g();
            update_scale_y();
            update_core_chart_axis();
            update_core_chart_y_grids();
            update_core_chart();
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
    let legend_cols = [
        ["Index", "ETF"],
        ["Active"],
        ["Bond"],
    ];

    let legends = d3
        .select(dom_id)
            .style("display", "grid")
            .style("grid-template-columns", `repeat(${mode_portrait ? 1 : 2}, 1fr)`)
            .style("grid-template-rows", `${mode_portrait ? "auto 1fr" : "1fr"}`)
            .style("gap", "10px 50px")
        .append("div")
            .style("width", `${mode_portrait ? "inherit" : "500px"}`)
            .style("font-family", font_sans_serif)
            .style("font-size", "15px")
            .style("line-height", "1.3")
            .style("color", "currentColor")
            .style("user-select", "none")
            .style("display", "grid")
            .style("grid-template-columns", "repeat(3, 1fr)")
            .style("height", `${mode_portrait ? "auto" : layout_main_chart.h + "px"}`)
            .style("column-gap", `${mode_portrait ? "10px" : "20px"}`);

    // Header for types of fund
    let legends_types = legends
        .selectAll("div")
            .data(legend_cols)
            .join("div")
            //.style("width", "145px")
            .style("max-width", "150px")
            .style("margin", "18px auto 0")
        .selectAll("div")
            .data(d => d)
            .join("div")
            .style("margin-bottom", "2em");

    legends_types
        .append("div")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("text-align", "center")
            .style("padding", "1px")
            //.style("text-decoration", "underline")
            //.style("text-underline-offset", "0.2em")
            .style("border-bottom", "1px solid #8888")
            //.style("border-radius", "5px")
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

    // Collapsible header for fund companies
    let legends_companies = legends_types
        .selectAll("details")
            .data(d => funds_grouped.get(d))
            .join("details")
            .property("open", true)
            .style("padding", "0.4em 0em");

    legends_companies
        .append("summary")
            .style("margin-left", "14px")
            .style("list-style-position", "outside")
        .append("span")
            .style("font-weight", "bold")
            .style("user-select", "none")
            .text(d => d[0]);

    // Legend item for funds
    let legends_items = legends_companies
        .selectAll("button")
            .data(d => d[1])
            .join("button")
            .attr("id", d => `legend-${d.name}`)
            .style("background", "none")
            .style("color", "inherit")
            .style("border", "1px solid #0000")
            .style("border-radius", "8px")
            .style("margin-left", "14px")
            .style("padding", "1px 6px")
            .style("font", "inherit")
            .style("display", "flex")
            .style("align-items", "center")
            .on("mouseover", mouseover_legend)
            .on("mouseleave", mouseleave_legend)
            .on("focusout", mouseleave_legend)
            .on("click", onclick_legend)
            .each(function(d) {
                if (selected_funds.includes(d.name))
                    this.checked = true;
            });

    // Legend color marker
    legends_items
        .append("span")
        .classed("legend-color", true)
        .style("display", "inline-block")
        .style("margin", "auto")
        .style("width", `${w_legend_marker}px`)
        .style("height", `${w_legend_marker}px`)
        .style("border-width", "1px")
        .style("border-style", "solid")
        .style("border-radius", "3px")
        .style("border-color", d => {
            let i = selected_funds.indexOf(d.name);
            return (i < 0) ? "currentColor" : colorScales(i);
        })
        .style("background-color", d => {
            let i = selected_funds.indexOf(d.name);
            return (i < 0) ? "#0000" : colorScales(i);
        })
        .style("opacity", d => {
            let i = selected_funds.indexOf(d.name);
            return (i < 0) ? 0.1 : 1;
        });

    // Legend text for fund names
    legends_items
        .append("span")
        .classed("legend-text", true)
        .style("margin", "auto 0 auto 5px")
        .style("text-align", "left")
        .text(d => d.name);

    function highlight_fund(fund) {
        let already_highlighted = core_chart.select(".core-chart-line-highlight").empty()
        if (!already_highlighted)
            return;

        let selected_line = g_lines.select(`.core-chart-line-${fund}`)
        if (!selected_line.empty()) {
            // Highlight line of selected fund
            let clone = core_chart.node().insertBefore(selected_line.node().cloneNode(false), tooltips.node());
            // let clone = core_chart.node().appendChild(selected_line.node().cloneNode(false));
            d3.select(clone)
                .classed("core-chart-line-highlight", true)
                .style("pointer-events", "none")
                // .transition()
                // .duration(100)
                .attr("stroke-opacity", 1)
                .attr("stroke-width", 3)

            // Reduce opacity of other lines
            core_paths
                // .transition()
                // .duration(100)
                .attr("stroke-opacity", 0.1);
            // d3.select(this).select("text")
            //     .attr("font-weight", "bold");

            // Highlight legend
            let legend = d3.select(`#legend-${fund}`);
            legend.style("border-color", "currentColor")
            legend.select(".legend-color")
                .style("border-radius", "0");

            // Highlight tooltips
            let l = tooltips_content.select(`.tooltips-line-${fund}`);
            l.select("text")
                .attr("font-weight", "bold");
            l.select("circle")
                .attr("r", r_tooltips_item + 2)
        }
    }

    function unhighlight_fund(fund) {
        core_chart.selectAll(".core-chart-line-highlight")
            // .transition()
            // .duration(60)
            .remove();
        core_paths
            // .transition()
            // .duration(100)
            .attr("stroke-opacity", core_paths_opacity);

        let legend = d3.select(`#legend-${fund}`);
        legend.style("border-color", "#0000")
        legend.select(".legend-color")
            .style("border-radius", "3px");

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
        this.checked = !this.checked;
        if (this.checked) {
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
        if (this.checked) {
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
    function update_core_chart_axis() {
        core_chart.selectAll(".core-axis-x")
            .transition()
            .duration(40)
            .call(x_axis_main(x));

        core_chart.selectAll(".core-axis-y")
            .transition()
            .duration(40)
            .call(d3.axisLeft(y).ticks(y_nticks).tickFormat(y_format));
    }

    // Update y grids
    function update_core_chart_y_grids() {
        core_chart.select(".grid-lines")
            .selectAll("line")
            .data(y.ticks(y_nticks))
            .join("line")
            .attr("stroke", "gray")
            .attr("stroke-opacity", 0.1)
            .attr("shape-rendering", "crispEdges")
            .attr("x1", 0)
            .attr("x2", layout_core_chart.w)
            .attr("y1", d => y(d))
            .attr("y2", d => y(d))
        .filter(d => d === 0)
            .attr("stroke-opacity", 0.6);
    }

    // Update main chart
    function update_core_chart() {
        g_lines.data(data_g)
            .join(
                enter => {
                    let g_new = enter.append("g")
                        .classed("g-line", true);
                    g_new.append("path")
                        .attr("class", d => `core-chart-line-${d.fund}`)
                        .classed("core-chart-line", true)
                        .attr("clip-path", "url(#clip)")
                        .attr("fill", "none")
                        .attr("stroke-width", 2)
                        .attr("stroke-opacity", core_paths_opacity)
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
                    update.select(".core-chart-line")
                        .attr("class", d => `core-chart-line-${d.fund}`)
                        .classed("core-chart-line", true)
                        .attr("stroke", (d, i) => colorScales(i))
                        .attr("d", d => line_generator(x)(d.info));
                    update.select("circle")
                        .attr("fill", (d, i) => colorScales(i))
                        .attr("stroke", (d, i) => colorScales(i));
                }
            );

        g_lines = g.selectAll(".g-line");
        core_paths = g_lines.select(".core-chart-line");
        crosshairs = g_lines.select("circle");
    }

    // Update minimap
    function update_minimap() {
        line_generator_mini = d3.line()
                .x(d => x_all(d.date))
                .y(d => y.copy().range([layout_minimap.h, 4])(d.value));

        minimap.select(".minimap-axis-x")
            .transition()
            // .call(d3.axisBottom(x_all).ticks(d3.utcYear));
            .call(d3.axisBottom(x_all).ticks(x_nticks(x_all.domain(), d3.utcYear)));

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
                                .attr("font-family", font_sans_serif)
                                // .attr("font-family", "monospace")
                                .attr("font-variant-numeric", "tabular-nums")
                                .attr("font-size", 12.5)
                                .attr("text-anchor", "left")
                                .attr("x", 9)
                                .attr("y", 4);

                    t_new.append("tspan")
                        .classed("tooltips-name", true)
                        .text(d => d.fund);

                    t_new.append("tspan")
                        .classed("tooltips-navps", true)
                        .attr("x", tooltips_width - 80)
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
        legends_items.selectAll(".legend-color")
            .style("border-color", d => {
                let i = selected_funds.indexOf(d.name);
                return (i < 0) ? "currentColor" : colorScales(i);
            })
            .style("background-color", d => {
                let i = selected_funds.indexOf(d.name);
                return (i < 0) ? "#0000" : colorScales(i);
            })
            .style("opacity", d => {
                let i = selected_funds.indexOf(d.name);
                return (i < 0) ? 0.1 : 1;
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
        update_core_chart_axis();
        update_core_chart_y_grids();
        update_core_chart();

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

