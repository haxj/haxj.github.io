"use strict";

let lang = 0;
let light_mode;
let chart_sankey;
let chart_pie;
let selected_tab = document.getElementById("tab-1");

const colors = {
    background: ["#1b1b1e", "#ffffff"],
    text:       ["#ffffff", "#000000"],
    brown: "#4d3d36",
    blue : "#2055A4",
    purple: "#6b2180",
    yellow: "#F9DB6D",
    green_2: "#1A936F",
    red: "#CC4430",
    blue_dark: "#033F63",
    green: "#006d2c",
};

[...document.getElementsByClassName("input-number")].forEach(function(input) {
    input.addEventListener('keyup', function(evt) {
        // Check to ensure this is not input selection event
        // e.g. with Ctrl-A, Shift-arrow, etc.
        if (evt.target.selectionStart === evt.target.selectionEnd) {
            let pos = evt.target.selectionStart;
            let len = this.value.length;
            let n = parseInt(this.value.replace(/\D/g, ''), 10);
            input.value = isNaN(n) ? 0 : n.toLocaleString();
            if (input.value.length == len + 1) {
                // a comma added to string
                pos++;
            } else if (input.value.length == len - 1) {
                // a comma removed from string
                pos--;
            }
            evt.target.selectionStart = evt.target.selectionEnd = pos;
        }
    }, false);
});

document.getElementById("user-form").addEventListener('keyup', function(evt) {
    evt.preventDefault();
    if (evt.key === 'Enter') {
        document.getElementById("btn-calc").click();
    }
});

document.getElementById("currency").onchange = function() {
    let exchg = document.getElementById("exchg");
    exchg.style.display = (this.value == "vnd") ? "none" : "flex";
    document.getElementById("currency-insr").value = this.value;
}

document.getElementById("set-insr-max").onclick = function() {
    let gross_monthly = parseInt(document.getElementById("gross-income").value.replace(/\D/g, ''), 10);
    if (document.getElementById("income-period").value === "annual") {
        gross_monthly /= 12;
    }
    document.getElementById("insurance-base").value = Math.round(gross_monthly).toLocaleString();
}

// document.getElementById("gross-income").onchange = function() {
//     let insr_base_elem = document.getElementById("insurance-base");
//     let insr_base = parseInt(insr_base_elem.value.replace(/\D/g,''), 10);
//     let gross = parseInt(this.value.replace(/\D/g,''),10);
//     if (gross < insr_base)
//         insr_base_elem.value = this.value;
// }

document.getElementsByName("res-opt").forEach(item => {
    item.addEventListener("change", function() {
        for (let i = 1; i <= 3; i++) {
            // document.getElementById(`tab-${i}`).style.display = "none";
            let tab = document.getElementById(`tab-${i}`)
            // tab.style.left = "-9999px";
            tab.style.visibility = "hidden";
        }

        // document.getElementById(`tab-${this.value}`).style.display = "block";
        selected_tab = document.getElementById(`tab-${this.value}`)
        // selected_tab.style.left = "0px";
        selected_tab.style.visibility = "visible";
        if (this.value === "3")
            selected_tab.parentElement.style.height = "unset";
        else
            selected_tab.parentElement.style.height = `${selected_tab.offsetHeight}px`;
    });
});

document.getElementById("mode-toggle-wrapper").addEventListener('click', update_theme);

document.getElementsByName("result-period").forEach(item => {
    item.addEventListener("change", function() {
        if (this.checked) {
            do_work();
            // switch (this.value) {
            // case "monthly":

            //     break;
            // case "annual":
            //     break;
            // }
        }
    });
});

const exchg_rate_default = 23000;

// Policy classes, contains constants according to current law
class Policy {
    constructor() {
        this.insurance = new InsurancePolicy();
        this.tax = new TaxPolicy();
    }
}

class InsurancePolicy {
    constructor() {
        this.annual = 0;
        this.regional_min_salary = [4680000, 4160000, 3640000, 3250000];
        this.gov_base_salary = 1490000;
        this.bhxh_rate = 0.08;
        this.bhyt_rate = 0.015;
        this.bhtn_rate = 0.01;
    }

    get_bhxh_base_max() {
        return 20 * this.gov_base_salary;
    }

    get_bhtn_base_max(region) {
        return 20 * this.regional_min_salary[region-1];
    }

    get_bh_base_min(region) {
        return this.regional_min_salary[region-1];
    }

    set_annual(annual) {
        if (this.annual != annual) {
            this.annual = annual;
            if (annual) {
                for (let i = 0; i < this.regional_min_salary.length - 1; i++) {
                    this.regional_min_salary[i] *= 12;
                }
                this.gov_base_salary *= 12;
            } else {
                for (let i = 0; i < this.regional_min_salary.length - 1; i++) {
                    this.regional_min_salary[i] /= 12;
                }
                this.gov_base_salary /= 12;
            }
        }
    }
}

class TaxPolicy {
    constructor() {
        this.annual = 0;
        this.standard_deduction = 11000000.0;
        this.per_dependent_deduction = 4400000.0;
        this.tax_rate = [[0, 0.05],
                        [5000000, 0.10],
                        [10000000, 0.15],
                        [18000000, 0.20],
                        [32000000, 0.25],
                        [52000000, 0.30],
                        [80000000, 0.35],
                        [Number.MAX_SAFE_INTEGER, NaN]];
        this.n_tax_levels = this.tax_rate.length;
    }

    set_annual(annual) {
        if (this.annual != annual) {
            this.annual = annual;
            if (annual) {
                this.standard_deduction *= 12;
                this.per_dependent_deduction *= 12;
                for (let i = 0; i < this.n_tax_levels - 1; i++) {
                    this.tax_rate[i][0] *= 12;
                }
            } else {
                this.standard_deduction /= 12;
                this.per_dependent_deduction /= 12;
                for (let i = 0; i < this.n_tax_levels - 1; i++) {
                    this.tax_rate[i][0] /= 12;
                }
            }
        }
    }
}

class CalcOptions {
    constructor() {
        this.annual = 0;
        this.currency = "VND";
        this.insurance_calc = true;
    }
}

class TaxpayerInfo {
    constructor() {
        this.gross = 0;
        this.insurance_base = 0;
        this.region = 0;
        this.n_dependents = 0;
        this.net = 0;
    }
}

class Insurance {
    constructor() {
        this.base_bhxh = 0;
        this.base_bhyt = 0;
        this.base_bhtn = 0;

        this.bhxh = 0;
        this.bhyt = 0;
        this.bhtn = 0;
    }

    total() {
        return this.bhxh + this.bhyt + this.bhtn;
    }
}

class Tax {
    constructor() {
        this.gross_no_insurance = 0;
        this.taxable = 0;
        this.tax_level = Array(8).fill(0);
        this.taxable_level = Array(8).fill(0);
        this.standard_deduction = 0;
        this.total_dep_deduction = 0;
        this.total_deduction = 0;
        this.total = 0;
    }
}

class Calculator {
    constructor() {
        this.options = new CalcOptions();
        this.info = new TaxpayerInfo();
        this.insurance = new Insurance();
        this.tax = new Tax();
        this.policy = new Policy();
        this.desc = [];
    }

    calculate() {
        if (this.options.annual)
            this.info.gross *= 12;

        this.desc = [];
        this.desc[0] = {
            title: 'Thu nhập',
            percentage: 100.00,
            details: [{ name: 'Thu nhập gross', formula: '', value: this.info.gross }]
        };

        this.calculate_insurance();
        this.tax.gross_no_insurance = this.info.gross - this.insurance.total();

        this.policy.tax.set_annual(this.options.annual);
        this.calculate_tax();
        this.info.net = this.tax.gross_no_insurance - this.tax.total;

        this.desc[1].percentage = this.percentage_insurance();
        this.desc[2].percentage = this.percentage_tax();
        this.desc.push({
            title: 'Thu nhập thực nhận (Net)',
            percentage: this.percentage_net(),
            details: [{ name: 'Thu nhập thực nhận', formula: `${Math.round(this.info.gross).toLocaleString()} - ${Math.round(this.insurance.total()).toLocaleString()} - ${Math.round(this.tax.total).toLocaleString()}`, value: this.info.net }]
        });
    }

    calculate_insurance() {
        let base_bhxh_max = this.policy.insurance.get_bhxh_base_max();
        let base_bhtn_max = this.policy.insurance.get_bhtn_base_max(this.info.region);
        let base_min = this.policy.insurance.get_bh_base_min(this.info.region);

        if (this.info.insurance_base > base_bhxh_max)
            this.insurance.base_bhxh = base_bhxh_max;
        // else if (this.info.insurance_base < base_min)
        //     this.insurance.base_bhxh = base_min;
        else
            this.insurance.base_bhxh = this.info.insurance_base;

        if (this.info.insurance_base > base_bhtn_max)
            this.insurance.base_bhtn = base_bhtn_max;
        // else if (this.info.insurance_base < base_min)
        //     this.insurance.base_bhtn = base_min;
        else
            this.insurance.base_bhtn = this.info.insurance_base;

        this.insurance.base_bhyt = this.insurance.base_bhxh;

        this.insurance.bhxh = this.policy.insurance.bhxh_rate
            * this.insurance.base_bhxh;
        this.insurance.bhyt = this.policy.insurance.bhyt_rate
            * this.insurance.base_bhyt;
        this.insurance.bhtn = this.policy.insurance.bhtn_rate
            * this.insurance.base_bhtn;

        let total_monthly = this.insurance.total();

        this.desc.push({
            title: 'Bảo hiểm',
            details: [
                { name: 'Mức lương tháng căn cứ đóng BHXH/BHYT', formula: '',                                                                                                                            value: this.insurance.base_bhxh },
                { name: 'Mức lương tháng căn cứ đóng BHTN',      formula: '',                                                                                                                            value: this.insurance.base_bhtn },
                { name: 'Mức đóng BHXH hàng tháng',              formula: `${(this.policy.insurance.bhxh_rate * 100).toLocaleString()}% x ${Math.round(this.insurance.base_bhxh).toLocaleString()}`,                 value: this.insurance.bhxh      },
                { name: 'Mức đóng BHYT hàng tháng',              formula: `${(this.policy.insurance.bhyt_rate * 100).toLocaleString()}% x ${Math.round(this.insurance.base_bhyt).toLocaleString()}`,                 value: this.insurance.bhyt      },
                { name: 'Mức đóng BHTN hàng tháng',              formula: `${(this.policy.insurance.bhtn_rate * 100).toLocaleString()}% x ${Math.round(this.insurance.base_bhtn).toLocaleString()}`,                 value: this.insurance.bhtn      },
                { name: 'Tổng đóng bảo hiểm hàng tháng',         formula: `${Math.round(this.insurance.bhxh).toLocaleString()} + ${Math.round(this.insurance.bhyt).toLocaleString()} + ${Math.round(this.insurance.bhtn).toLocaleString()}`, value: total_monthly   },
            ]
        });

        if (this.options.annual) {
            this.insurance.bhxh *= 12;
            this.insurance.bhyt *= 12;
            this.insurance.bhtn *= 12;

            this.desc[this.desc.length-1].details.push(
                { name: 'Tổng đóng bảo hiểm hàng năm',         formula: `${Math.round(total_monthly).toLocaleString()} x 12`, value: this.insurance.total()   },
            );
        }
    }

    calculate_tax() {
        this.tax.standard_deduction = this.policy.tax.standard_deduction;
        this.tax.total_dep_deduction = this.info.n_dependents * this.policy.tax.per_dependent_deduction;
        this.tax.total_deduction = this.policy.tax.standard_deduction + this.tax.total_dep_deduction;
        this.tax.taxable = this.tax.gross_no_insurance - this.tax.total_deduction;
        if (this.tax.taxable < 0) {
            this.tax.taxable = 0;
        }

        this.desc.push({
            title: 'Thuế ',
            details: [
                { name: 'Thu nhập chịu thuế',                    formula: `${Math.round(this.info.gross).toLocaleString()} - ${Math.round(this.insurance.total()).toLocaleString()}`,               value: this.tax.gross_no_insurance  },
                { name: 'Giảm trừ gia cảnh cho bản thân',        formula: '',                                                                                               value: this.tax.standard_deduction  },
                { name: 'Giảm trừ gia cảnh cho người phụ thuộc', formula: `${this.policy.tax.per_dependent_deduction.toLocaleString()} x ${this.info.n_dependents}`,        value: this.tax.total_dep_deduction },
                { name: 'Tổng giảm trừ gia cảnh',                formula: `${this.tax.standard_deduction.toLocaleString()} + ${this.tax.total_dep_deduction}`,              value: this.tax.total_deduction     },
                { name: 'Thu nhập tính thuế',                    formula: `${Math.round(this.tax.gross_no_insurance).toLocaleString()} - ${this.tax.total_deduction.toLocaleString()}`, value: this.tax.taxable             },
            ]
        });

        this.tax.total = 0;
        let i = 0;
        let formula_total_tax = '';
        while (this.tax.taxable >= this.policy.tax.tax_rate[i + 1][0]) {
            this.tax.taxable_level[i] = this.policy.tax.tax_rate[i + 1][0] - this.policy.tax.tax_rate[i][0]
            this.tax.tax_level[i] = this.tax.taxable_level[i] * this.policy.tax.tax_rate[i][1];

            this.desc[2].details.push({ name: `Thuế bậc ${i+1}`, formula: `${Math.round(this.tax.taxable_level[i]).toLocaleString()} x ${this.policy.tax.tax_rate[i][1] * 100}%`, value: this.tax.tax_level[i] });
            formula_total_tax += `${Math.round(this.tax.tax_level[i]).toLocaleString()} + `

            this.tax.total += this.tax.tax_level[i];
            i++;
        }
        this.tax.taxable_level[i] = this.tax.taxable - this.policy.tax.tax_rate[i][0];
        this.tax.tax_level[i] = this.tax.taxable_level[i] * this.policy.tax.tax_rate[i][1];
        this.tax.total += this.tax.tax_level[i];

        formula_total_tax += `${Math.round(this.tax.tax_level[i]).toLocaleString()}`
        this.desc[2].details.push(...[{ name: `Thuế bậc ${i+1}`, formula: `${Math.round(this.tax.taxable_level[i]).toLocaleString()} x ${this.policy.tax.tax_rate[i][1] * 100}%`, value: this.tax.tax_level[i] },
                         { name: 'Tổng thuế phải đóng', formula: formula_total_tax, value: this.tax.total },
        ]);

        // set the higher level tax to zero
        for (i++; i < this.tax.tax_level.length; i++) {
            this.tax.tax_level[i] = 0;
            this.tax.taxable_level[i] = 0;
        }
    }

    percentage_insurance() {
        return this.insurance.total() / this.info.gross * 100;
    }

    percentage_tax() {
        return this.tax.total / this.info.gross * 100;
    }

    percentage_net() {
        return this.info.net / this.info.gross * 100;
    }
}

let calc = new Calculator();

document.getElementById("btn-calc").onclick = function() {
    do_work();
    document.getElementById("results").scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function do_work(event) {
    getInfoFromUI();
    calc.calculate();
    updateUI();
    update_theme();
};

do_work();

function getInfoFromUI() {
    let gross_monthly = Number.parseInt(document.getElementById("gross-income").value.replace(/,/g, ''));
    if (gross_monthly < 0) {
        return;
    }

    if (document.getElementById("income-period").value === "annual") {
        gross_monthly /= 12;
    }

    let insr_base = Number.parseInt(document.getElementById("insurance-base").value.replace(/,/g, ''));
    if (insr_base !== 0)
        calc.options.insurance_calc = true;

    // Currency converter
    let exchg_rate = exchg_rate_default;
    let currency = document.getElementById("currency").value;
    if (currency === "usd") {
        exchg_rate = Number.parseInt(document.getElementById("exchg-rate").value.replace(/,/g, ''));
        gross_monthly *= exchg_rate;
        insr_base *= exchg_rate;
    }

    if (insr_base > gross_monthly) {
        insr_base = gross_monthly;
        if (currency === "usd")
            document.getElementById("insurance-base").value = Math.round(insr_base / exchg_rate).toLocaleString();
        else
            document.getElementById("insurance-base").value = Math.round(insr_base).toLocaleString();
    }

    if (document.getElementById("result-monthly").checked) {
        calc.options.annual = 0;
    } else {
        calc.options.annual = 1;
    }

    calc.info.gross = gross_monthly;
    calc.info.insurance_base = insr_base;
    calc.options.currency = currency;

    calc.info.n_dependents = Number(document.getElementById("dependents").value);
    calc.info.region = Number(document.getElementById("region").value);
}

function update_theme() {
    // Handle dark/light mode
    light_mode = toggle.modeStatus === ModeToggle.LIGHT_MODE ? 1 : 0;
    
    d3.select("html")
        .attr("data-theme", light_mode ? "light" : "dark")
        .classed("tw-dark", !light_mode);

    chart_pie.update_theme(light_mode);
    chart_sankey.update_theme(light_mode);

}


function updateUI() {
    document.getElementById("res-gross").innerHTML = `${calc.info.gross.toLocaleString()}`;
    document.getElementById("res-insurance").innerHTML = `${calc.insurance.total().toLocaleString()}`;
    document.getElementById("res-tax").innerHTML = `${calc.tax.total.toLocaleString()}`;
    document.getElementById("res-net").innerHTML = `${calc.info.net.toLocaleString()}`;

    let tables = [];
    calc.desc.forEach(desc => {
        let table = document.createElement('table');
        table.style.width='100%';
        // table.style.borderCollapse = 'separate';
        // table.style.borderSpacing = '0 8px';
        // let row_title = table.insertRow();
        // row_title.style.backgroundColor = '#f0f0f0'

        // let cell_title = row_title.insertCell()
        // cell_title.appendChild(document.createTextNode(`${desc.title}`));
        // cell_title.style.fontWeight = 'bold';

        // let cell_perc = row_title.insertCell();
        // cell_perc.appendChild(document.createTextNode(`${desc.percentage.toFixed(2)}%`));
        // cell_perc.style.fontWeight = 'bold';
        // cell_perc.style.textAlign = 'right';

        desc.details.forEach((item, i, details) => {
            let row = table.insertRow();
            if (i === details.length - 1) {
                row.style.fontWeight = 'bold';
                if (i !== 0)
                    row.style.borderTop = "thin dotted #DDD"
            }
            // row.style.textIndent = '20px';
            let cell0 = row.insertCell();
            cell0.appendChild(document.createTextNode(`${item.name}: `));
            cell0.style.paddingTop = "0.4rem";
            if (item.formula === '') {
                cell0.style.paddingBottom = "0.4rem";
                // row.style.borderBottom = "thin dotted #DDD"
                row.style.marginBottom = 2;
                let cell = row.insertCell();
                cell.appendChild(document.createTextNode(`${Math.round(item.value).toLocaleString()}`));
                cell.style.textAlign = "right";
                cell.style.paddingTop = "0.4rem";
                cell.style.paddingBottom = "0.4rem";
            } else {
                let row = table.insertRow();
                if (i === details.length - 1) {
                    row.style.fontWeight = 'bold';
                    if (i !== 0)
                        row.style.borderBottom = "thin dotted #DDD"
                }
                // row.style.borderBottom = "thin dotted #DDD"
                let cell = row.insertCell();
                cell.appendChild(document.createTextNode(`${item.formula}`));
                cell.style.textAlign = "center";
                cell.style.paddingBottom = "0.4rem";
                cell = row.insertCell();
                cell.appendChild(document.createTextNode(`${Math.round(item.value).toLocaleString()}`));
                cell.style.textAlign = "right";
                cell.style.paddingBottom = "0.4rem";
            }
        });

        tables.push(table);
    });

    document.getElementById("explain-gross").innerHTML = '';
    document.getElementById("explain-gross").appendChild(tables[0]);
    document.getElementById("explain-insurance").innerHTML = '';
    document.getElementById("explain-insurance").appendChild(tables[1]);
    document.getElementById("perc-insurance").textContent = `${calc.percentage_insurance().toFixed(2)}%`;
    document.getElementById("explain-tax").innerHTML = '';
    document.getElementById("explain-tax").appendChild(tables[2]);
    document.getElementById("perc-tax").textContent = `${calc.percentage_tax().toFixed(2)}%`;
    document.getElementById("explain-net").innerHTML = '';
    document.getElementById("explain-net").appendChild(tables[3]);
    document.getElementById("perc-net").textContent = `${calc.percentage_net().toFixed(2)}%`;

    chart_sankey = new draw_sankey("#container-chart-sankey");
    chart_pie = new draw_pie("#container-chart-pie");

    selected_tab.parentElement.style.height = `${selected_tab.offsetHeight}px`;
}

function draw_pie(container_id) {
    let width = 800,
        height = 600,
        margin = 140,
        outerRadius = Math.min(width, height) / 2 - margin,
        innerRadius = outerRadius * 0.4,
        fontSize = 18;

    // let scale = width / d3.select(svg.node().parentNode).node().getBoundingClientRect().width;
    let scale = width / d3.select("#results").node().getBoundingClientRect().width;
    let text_scale = (scale < 1) ? 1 : 1 + 0.55 * (scale - 1);

    d3.select(container_id).selectAll("svg").remove();
    let svg = d3.select(container_id)
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("preserveAspectRatio", "xMinYMin")
        // .attr("width", width)
        // .attr("height", height)
        // .style("min-width", 500)
        .append("g")
        .attr("id", "income-pie")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    let data = [
        { id: 'insurance', name:'Bảo hiểm',  value: calc.insurance.total(), color: colors.blue },
        { id: 'tax',       name:'Thuế',      value: calc.tax.total,         color: colors.red },
        { id: 'net',       name:'Thực nhận', value: calc.info.net,          color: colors.green },
    ];

    if (!calc.options.insurance_calc) {
        data.shift();
    }

    let total = d3.sum(data, d => d.value);
    data.forEach(function(d) {
        d.percentage = d.value / total * 100;
    });

    let pie = d3.pie()
        .sort(null)
        .value(d => d.value);

    let labelRadius = (innerRadius * 0.2 + outerRadius * 0.8);
    let label = d3.arc()
        .outerRadius(labelRadius)
        .innerRadius(labelRadius);

    let arc = svg.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .classed("arc", true);

    let arc_gen = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    arc.append("path")
        .classed("pie-part", true)
        .attr("fill", d => d.data.color)
        // .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("opacity", 0.8)
            .transition()
            .duration(600)
            .attrTween("d", function(d) {
                let i = d3.interpolate(d.startAngle, d.endAngle);
                return function(t) {
                    d.endAngle = i(t);
                    return arc_gen(d);
                };
            });

    arc.append("title")
        .text(d => `${d.data.name}\n${Math.round(d.data.value).toLocaleString()} VND`);

    let outerArcRadius = outerRadius * 1.4;
    let outerArc = d3.arc()
        .innerRadius(outerArcRadius)
        .outerRadius(outerArcRadius)

    let polylines = arc.append('polyline')
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function(d) {
                var posA = label.centroid(d); // line insertion in the slice
                var posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
                var posC = outerArc.centroid(d); // Label position = almost the same as posB
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
                posC[0] = outerArcRadius * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                return [posA, posB, posC];
            });

    let labels = arc.append('text')
            .attr("font-size", fontSize * text_scale)
            .attr('transform', function(d) {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                pos[0] = outerArcRadius * (midangle < Math.PI ? 1 : -1);
                pos[1] -= 3;
                return `translate(${pos})`;
            })
            .style('text-anchor', function(d) {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                return (midangle < Math.PI ? 'start' : 'end')
            });

    labels.append("tspan")
        .text(d => d.data.name);

    labels.append("tspan")
        .attr("font-size", fontSize * 0.8 * text_scale)
        .attr("x", 0)
        .attr("dy", "1.0em")
        .text(d => `(${d.data.percentage.toFixed(2)}%)`)
    // svg.attr("transform", "translate(" + width / 2 * text_scale + "," + height / 2 + ")");

    this.update_theme = function(light_mode) {
        labels
            .attr("fill", colors.text[light_mode]);
        polylines
            .attr("stroke", colors.text[light_mode]);
        arc.selectAll(".pie-part")
            .attr("stroke", colors.background[light_mode]);
    }
}

function draw_sankey(container_id) {
    const margin = 36;
    const width = 1200;
    let height = 500;
    const svgBackground = "#fff";
    const svgBorder = "1px solid #fff";
    let nodeWidth = 15;
    let nodePadding = 19;
    const nodeOpacity = 0.9;
    const linkOpacity = 0.3;
    const nodeDarkenFactor = 0.3;
    const nodeStrokeWidth = 2;
    const arrow = "\u2192";
    const nodeSort = null;
    const linkSort = null;
    const nodeAlignment = d3.sankeyJustify;
    let nodeTextSize = 16;
    // const colorScale = d3.interpolateRainbow;
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const path = d3.sankeyLinkHorizontal();

    function darkenColor(color, factor) {
        return d3.color(color).darker(factor)
    }

    // Prepare data for sankey
    const data = {
        nodes: [
            { id: "gross",      name: [ "Tổng thu nhập",        "Gross income"           ], color: colors.brown  },
            { id: "insurance1", name: [ "Bảo hiểm",             "Total insurance"        ], color: colors.blue   },
            { id: "bhxh",       name: [ "Xã hội",               "Social insurance"       ], color: colors.blue   },
            { id: "bhyt",       name: [ "Y tế",                 "Heath insurance"        ], color: colors.blue   },
            { id: "bhtn",       name: [ "Thất nghiệp",          "Unemployment insurance" ], color: colors.blue   },
            { id: "insurance2", name: [ "Bảo hiểm",             "Total insurance"        ], color: colors.blue   },
            { id: "taxable",    name: [ "Thu nhập tính thuế",   "Taxable income"         ], color: colors.purple },
            { id: "deduction",  name: [ "Giảm trừ gia cảnh",    "Total deduction"        ], color: colors.green  },
            { id: "tax",        name: [ "Thuế",                 "Tax"                    ], color: colors.red    },
            { id: "net",        name: [ "Thực nhận",            "Net income"             ], color: colors.green  },
        ],
        links: [
            { source: "gross",      target: "insurance1", value: calc.insurance.total(), color: colors.blue },

            { source: "insurance1", target: "bhxh",       value: calc.insurance.bhxh,    color: colors.blue },
            { source: "insurance1", target: "bhyt",       value: calc.insurance.bhyt,    color: colors.blue },
            { source: "insurance1", target: "bhtn",       value: calc.insurance.bhtn,    color: colors.blue },

            { source: "bhxh",       target: "insurance2", value: calc.insurance.bhxh,    color: colors.blue },
            { source: "bhyt",       target: "insurance2", value: calc.insurance.bhyt,    color: colors.blue },
            { source: "bhtn",       target: "insurance2", value: calc.insurance.bhtn,    color: colors.blue },

            { source: "gross",      target: "taxable",    value: calc.tax.taxable,       color: colors.purple },
        ]
    }

    let i = 0;
    for (i = 0; (i < calc.tax.tax_level.length) && (calc.tax.taxable_level[i] > 0); i++) {
        var node_id = "taxable_level_" + i;
        data.nodes.push({ id: node_id, name: [ `${calc.policy.tax.tax_rate[i][1] * 100}% (bậc ${i+1})`, `${calc.policy.tax.tax_rate[i][1] * 100}% tax` ], color: colors.purple });

        data.links.push({ source: "taxable", target: node_id, value: calc.tax.taxable_level[i],                         color: colors.purple });
        data.links.push({ source: node_id,   target: "tax",   value: calc.tax.tax_level[i],                             color: colors.red });
        data.links.push({ source: node_id,   target: "net",   value: calc.tax.taxable_level[i] - calc.tax.tax_level[i], color: colors.green });
    }

    data.nodes.push(...[
        { id: "std_deduction", name: [ "Bản thân",        "Standard deduction"     ], color: colors.green },
        { id: "dep_deduction", name: [ "Người phụ thuộc", "Dependent(s) deduction" ], color: colors.green },
    ]);

    data.links.push(...[
        { source: "gross",         target: "deduction",     value: calc.tax.total_deduction,     color: colors.green },
        { source: "deduction",     target: "std_deduction", value: calc.tax.standard_deduction,  color: colors.green },
        { source: "std_deduction", target: "net",           value: calc.tax.standard_deduction,  color: colors.green },
        { source: "deduction",     target: "dep_deduction", value: calc.tax.total_dep_deduction, color: colors.green },
        { source: "dep_deduction", target: "net",           value: calc.tax.total_dep_deduction, color: colors.green },
    ]);

    data.links = data.links.filter(item => (item.value > 0));

    // let scale = width / d3.select(container_id).node().getBoundingClientRect().width;
    let scale = width / d3.select("#results").node().getBoundingClientRect().width;
    let scale_2 = (1 + 0.4 * (scale - 1));
    height *= scale_2;
    nodeWidth *= scale_2;
    nodePadding *= scale_2;
    nodeTextSize = Math.floor(nodeTextSize * (1 + 0.45 * (scale - 1)));

    // Create sankey svg
    d3.select(container_id).selectAll("svg").remove();
    const svg = d3.select(container_id)
                  .append("svg")
                  .attr("viewBox", [0, 0, width, height])
                  .attr("preserveAspectRatio", "xMinYMin")
                //   .style("min-width", 1000)
                //   .attr("width", width)
                //   .attr("height", height)
                //   .style("background-color", svgBackground)
                //   .style("border", svgBorder)

    let g_main = svg.append("g")
                  .attr("id", "income-sankey")
                  .attr("transform", `translate(${margin},${margin})`);

    // Define our sankey instance.
    const graphSize = [width - 2*margin, height - 2*margin];
    // console.log(graphSize)
    const sankey = d3.sankey()
                     .size(graphSize)
                     .nodeId(d => d.id)
                     .nodeWidth(nodeWidth)
                     .nodePadding(nodePadding)
                     .nodeSort(nodeSort)
                     .nodeAlign(nodeAlignment)
                     .linkSort(linkSort);
    let graph = sankey(data);
    graph.nodes = graph.nodes.filter(item => (item.value > 0));

    // This is a bit hacky. For same-depth nodes that is too close to each other, the higher node label might overlap the lower one.
    // Without reversing, lower nodes are added to SVG after higher ones, therefore lower node's label will cover high node's one.
    // We reverse the nodes so that higher nodes is added to SVG after lower nodes.
    graph.nodes.reverse();
    graph = sankey.update(graph);

    // Build the links.
    let svgLinks = g_main.append("g")
                      .classed("links", true)
                      .selectAll(".link")
                      .data(graph.links)
                      .enter()
                        .append("path")
                        .classed("link", true);

    svgLinks.attr("d", path)
        .attr("fill", "none")
        // .attr("stroke", ({target: {index: i}}) => color(i))
        .attr("stroke", d => d.color)
        .attr("stroke-width", d => Math.max(1.0, d.width))
        .attr("stroke-opacity", linkOpacity);

    // Add hover effect to links.
    svgLinks.append("title")
            .text(d => `${d.source.name[lang]} ${arrow} ${d.target.name[lang]}\n${Math.round(d.value).toLocaleString()} VND`);

    let svgNodes = g_main.append("g")
                      .classed("nodes", true)
                      .selectAll("rect")
                      .data(graph.nodes)
                      .enter()
                      .append("g")
                      .classed("node", true);

    svgNodes.append("rect")
            .classed("node-rect", true)
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("width", nodeWidth)
            .attr("height", d => d.y1 - d.y0)
            // .attr("fill", d => d.fillColor)
            .attr("fill", d => d.color)
            .attr("opacity", nodeOpacity)
            .attr("stroke", d => d.color)
            // .attr("stroke", d => darkenColor(d.color, nodeDarkenFactor))
            .attr("stroke-width", nodeStrokeWidth);

    let node_labels = svgNodes.append("text")
        .classed("node-label", true)
        .attr("x", d => d.x0 - 7)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        // .attr("transform", `scale(${text_scale})`)
        .attr("pointer-events", "none")
        .attr("fill", "black")
        // .attr("font-size", nodeTextSize * text_scale)
        .attr("font-size", nodeTextSize)

    // node_labels.filter(d => d.x0 < width / 2)
    node_labels.filter(d => d.depth < 3)
        .attr("x", d => d.x1 + 7)
        .attr("text-anchor", "start");

    node_labels.append("tspan")
        .text(d => d.name[lang])

    // svgNodes.selectAll("text").call(getTextBox);
    node_labels.call(getTextBox);

    svgNodes.insert("rect", "text")
            .classed("bg-label", true)
            .attr("rx", 10)
            .attr("x", function(d){return d.bbox.x - 6})
            .attr("y", function(d){return d.bbox.y - 2})
            .attr("width", function(d){return d.bbox.width + 12})
            .attr("height", function(d){return d.bbox.height + 4})
            .attr("opacity", 0.0)
            .style("fill", "#FFF");

    function getTextBox(selection) {
        selection.each(function(d) { d.bbox = this.getBBox(); })
    }

    // Add hover effect to nodes.
    svgNodes.append("title")
            // .text(d => `${d.name[lang]}\n${d.value.toLocaleString()} VND`);
            .text(d => `${Math.round(d.value).toLocaleString()} VND`);

    // let tooltips = svg.append("g")
    //     .classed("tooltips", true);
    // tooltips.append("rect")
    //         .attr("rx", 10)
    //         .attr("opacity", 0.95)
    //         .attr("stroke", "#000")
    //         .attr("stroke-width", 1)
    //         .style("fill", "#FFF")
    // tooltips.append("text");

    // svgNodes.selectAll(".node-rect")
    svgNodes
            .on("mouseenter", function(e, d) {
                // let parent_node = d3.select(this.parentNode);
                let parent_node = d3.select(this);

                parent_node.select("text").append("tspan")
                        .classed("node-label-details", true)
                        .attr("x", d => d.x0 - 7)
                        .attr("dy", "1.4em")
                        .attr("text-anchor", "end")
                        // .attr("transform", `scale(${text_scale})`)
                        .attr("pointer-events", "none")
                        .attr("font-size", nodeTextSize)
                        .text(`${Math.round(d.value).toLocaleString()} VND`)
                    // .filter(d => d.x0 < width / 2)
                    .filter(d => d.depth < 3)
                        .attr("x", d => d.x1 + 7)
                        .attr("text-anchor", "start")

                let bbox = parent_node.select("text").node().getBBox();
                parent_node.select(".bg-label")
                    .attr("x", bbox.x - 6)
                    .attr("y", bbox.y - 2)
                    .attr("width", bbox.width + 12)
                    .attr("height", bbox.height + 4);

                parent_node.selectAll(".bg-label")
                        .transition()
                        .duration(200)
                        .attr("stroke", "#000")
                        .attr("stroke-width", 1)
                        .attr("opacity", 0.95);

                parent_node.selectAll(".node-label")
                        .attr("fill", "black");

                d.sourceLinks.forEach(function(l) {
                    let nodes = svgNodes.filter(n => n.id == l.target.id);
                    nodes
                            .selectAll(".bg-label")
                            .transition()
                            .duration(200)
                            .attr("stroke", "#000")
                            .attr("stroke-width", 1)
                            .attr("opacity", 0.95);
                    nodes.selectAll(".node-label")
                        .attr("fill", "black");
                });
                d.targetLinks.forEach(function(l) {
                    let nodes = svgNodes.filter(n => n.id == l.source.id);
                    nodes
                            .selectAll(".bg-label")
                            .transition()
                            .duration(200)
                            .attr("stroke", "#000")
                            .attr("stroke-width", 1)
                            .attr("opacity", 0.95);
                    nodes.selectAll(".node-label")
                        .attr("fill", "black");
                });
                svgLinks.transition()
                        .duration(200)
                        .attr("stroke-opacity", 0.15);
                svgLinks.filter(l => (l.target.id == d.id) || (l.source.id == d.id))
                        .transition()
                        .duration(200)
                        .attr("stroke-opacity", 0.65);

                // Show tooltips
                // tooltips.attr("opacity", 1);
                // tooltips.select("text")
                //     .text(parent_node.select("title").text())
                // let bbox = tooltips.select("text").node().getBBox();
                // tooltips.select("rect")
                //     .attr("x", bbox.x - 6)
                //     .attr("y", bbox.y - 2)
                //     .attr("width", bbox.width + 12)
                //     .attr("height", bbox.height + 4)
            })
            .on("mousemove", function(e) {
                // let mouse_pos = d3.pointers(e)[0];
                // tooltips.attr("transform", `translate(${mouse_pos[0] + 8}, ${mouse_pos[1] - 8})`)
            })
            .on("mouseleave", function(d) {
                // let parent_node = d3.select(this.parentNode);
                let parent_node = d3.select(this);
                parent_node.select("text").select(".node-label-details").remove();

                let bbox = parent_node.select("text").node().getBBox();
                parent_node.select(".bg-label")
                    .attr("x", bbox.x - 6)
                    .attr("y", bbox.y - 2)
                    .attr("width", bbox.width + 12)
                    .attr("height", bbox.height + 4);

                svgNodes.selectAll(".bg-label")
                        .transition()
                        .duration(200)
                        .attr("opacity", 0);
                svgNodes.selectAll(".node-label")
                        .attr("fill", colors.text[light_mode]);
                svgLinks.transition()
                        .duration(200)
                        .attr("stroke-opacity", linkOpacity);
                // Remove tooltips
                // tooltips.attr("opacity", 0);
            });

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", colors.background[light_mode])
        .transition()
        .duration(600)
        .attr("transform", `translate(${width}, 0)`)
        .remove();

    // svgNodes.call(d3.drag()
    //                 .on("start", onDragStart)
    //                 .on("drag", onDragDragging)
    //                 .on("end", onDragEnd));

    this.update_theme = function(light_mode) {
        node_labels
            .attr("fill", colors.text[light_mode]);
    }
}

// document.getElementById("tab-2").style.display = "none";
// document.getElementById("tab-3").style.display = "none";
// document.getElementById("tab-2").style.left = "-9999px";
// document.getElementById("tab-3").style.left = "-9999px";
document.getElementById("tab-2").style.visibility = "hidden";
document.getElementById("tab-3").style.visibility = "hidden";

// function drawSankey() {
//     var units = "Widgets";

//     // set the dimensions and margins of the graph
//     var margin = { top: 1000, right: 10, bottom: 10, left: 1000 },
//         width = 700 - margin.left - margin.right,
//         height = 300 - margin.top - margin.bottom;

//     // format variables
//     var formatNumber = d3.format(",.0f"),    // zero decimal places
//         format = function (d) { return formatNumber(d) + " " + units; },
//         color = d3.scaleOrdinal(d3.schemeCategory20);

//     // append the svg object to the body of the page
//     var svg = d3.select("body").append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform",
//             "translate(" + margin.left + "," + margin.top + ")");

//     // Set the sankey diagram properties
//     var sankey = d3.sankey()
//         .nodeWidth(36)
//         .nodePadding(40)
//         .size([width, height]);

//     var path = sankey.links();

//     // load the data
//     d3.json("sankey.json", function (error, graph) {

//         sankey
//             .nodes(graph.nodes)
//             .links(graph.links);
//             // .layout(32);

//         // add in the links
//         var link = svg.append("g").selectAll(".link")
//             .data(graph.links)
//             .enter().append("path")
//             .attr("class", "link")
//             .attr("d", path)
//             .style("stroke-width", function (d) { console.log(d); return Math.max(1, d.dy); })
//             .sort((a, b) => b.dy - a.dy);

//         // add the link titles
//         link.append("title")
//             .text(function (d) {
//                 return d.source.name + " → " +
//                     d.target.name + "\n" + format(d.value);
//             });

//         // add in the nodes
//         var node = svg.append("g").selectAll(".node")
//             .data(graph.nodes)
//             .enter().append("g")
//             .attr("class", "node");
//             // .attr("transform", function (d) {
//             //     console.log(d);
//             //     return "translate(" + d.x + "," + d.y + ")";
//             // })
//             // .call(d3.drag()
//             //     .subject(function (d) {
//             //         return d;
//             //     })
//             //     .on("start", function () {
//             //         this.parentNode.appendChild(this);
//             //     })
//             //     .on("drag", dragmove));

//         // add the rectangles for the nodes
//         node.append("rect")
//             .attr("height", function (d) { return d.dy; })
//             .attr("width", sankey.nodeWidth())
//             .style("fill", function (d) {
//                 return d.color = color(d.name.replace(/ .*/, ""));
//             })
//             .style("stroke", function (d) {
//                 return d3.rgb(d.color).darker(2);
//             })
//             .append("title")
//             .text(function (d) {
//                 return d.name + "\n" + format(d.value);
//             });

//         // add in the title for the nodes
//         // node.append("text")
//         //     .attr("x", -6)
//         //     .attr("y", function (d) { return d.dy / 2; })
//         //     .attr("dy", ".35em")
//         //     .attr("text-anchor", "end")
//         //     .attr("transform", null)
//         //     .text(function (d) { return d.name; })
//         //     .filter(function (d) { return d.x < width / 2; })
//         //     .attr("x", 6 + sankey.nodeWidth())
//         //     .attr("text-anchor", "start");

//         // the function for moving the nodes
//         function dragmove(d) {
//             d3.select(this)
//                 .attr("transform",
//                     "translate("
//                     + d.x + ","
//                     + (d.y = Math.max(
//                         0, Math.min(height - d.dy, d3.event.y))
//                     ) + ")");
//             sankey.relayout();
//             link.attr("d", path);
//         }
//     });
// }

// function drawSankey() {
//     var height = 600;
//     var width = 954;

//     data = function () {
//         const links = FileAttachment("energy.csv").csv({ typed: true });
//         const nodes = Array.from(new Set(links.flatMap(l => [l.source, l.target])), name => ({ name, category: name.replace(/ .*/, "") }));
//         return { nodes, links, units: "TWh" };
//     }();

//     color = function () {
//         const color = d3.scaleOrdinal(d3.schemeCategory10);
//         return d => color(d.category === undefined ? d.name : d.category);
//     }();

//     format = function () {
//         const format = d3.format(",.0f");
//         return data.units ? d => `${format(d)} ${data.units}` : format;
//     }();

//     sankey = function () {
//         const sankey = d3.sankey()
//             .nodeId(d => d.name)
//             .nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
//             .nodeWidth(15)
//             .nodePadding(10)
//             .extent([[1, 5], [width - 1, height - 5]]);
//         return ({ nodes, links }) => sankey({
//             nodes: nodes.map(d => Object.assign({}, d)),
//             links: links.map(d => Object.assign({}, d))
//         });
//     }();

//     chart = function () {
//         const svg = d3.create("svg")
//             .attr("viewBox", [0, 0, width, height]);

//         const { nodes, links } = sankey(data);

//         svg.append("g")
//             .attr("stroke", "#000")
//             .selectAll("rect")
//             .data(nodes)
//             .join("rect")
//             .attr("x", d => d.x0)
//             .attr("y", d => d.y0)
//             .attr("height", d => d.y1 - d.y0)
//             .attr("width", d => d.x1 - d.x0)
//             .attr("fill", color)
//             .append("title")
//             .text(d => `${d.name}\n${format(d.value)}`);

//         const link = svg.append("g")
//             .attr("fill", "none")
//             .attr("stroke-opacity", 0.5)
//             .selectAll("g")
//             .data(links)
//             .join("g")
//             .style("mix-blend-mode", "multiply");

//         if (edgeColor === "path") {
//             const gradient = link.append("linearGradient")
//                 .attr("id", d => (d.uid = DOM.uid("link")).id)
//                 .attr("gradientUnits", "userSpaceOnUse")
//                 .attr("x1", d => d.source.x1)
//                 .attr("x2", d => d.target.x0);

//             gradient.append("stop")
//                 .attr("offset", "0%")
//                 .attr("stop-color", d => color(d.source));

//             gradient.append("stop")
//                 .attr("offset", "100%")
//                 .attr("stop-color", d => color(d.target));
//         }

//         link.append("path")
//             .attr("d", d3.sankeyLinkHorizontal())
//             .attr("stroke", d => edgeColor === "none" ? "#aaa"
//                 : edgeColor === "path" ? d.uid
//                     : edgeColor === "input" ? color(d.source)
//                         : color(d.target))
//             .attr("stroke-width", d => Math.max(1, d.width));

//         link.append("title")
//             .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

//         svg.append("g")
//             .attr("font-family", "sans-serif")
//             .attr("font-size", 10)
//             .selectAll("text")
//             .data(nodes)
//             .join("text")
//             .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
//             .attr("y", d => (d.y1 + d.y0) / 2)
//             .attr("dy", "0.35em")
//             .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
//             .text(d => d.name);

//         return svg.node();
//     }();
// }

// var prev_value = 0;
// document.getElementById("gross-vnd").onkeyup = function (_e) {
//     var text_input = document.getElementById("gross-vnd");
//     var key = _e.key;
//     var text = text_input.value;
//     var value = 0;
//     if (text == "") {
//         value = 0;
//     } else if (/^[0-9,]+$/i.test(text)) {
//         prev_value = value;
//         value = numeral(text_input.value).value();
//         console.log(value.toLocaleString());
//     } else {
//         value = prev_value;
//     }
//     text_input.value = value.toLocaleString("en");
// }