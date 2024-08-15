---
layout: "funds-chart"
title:  "Vietnam export and import by countries, from 1995 to 2022"
date:   2023-08-09 23:02:20 +0700
categories: [blog, economics]
tags: [d3.js, economics, data visualization, vietnam]
---

<!--script defer src="https://d3js.org/d3.v7.min.js"></script>-->
<!--<script defer src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js"></script>-->
<!--script defer src="{{ '/assets/js/custom/vntrade.js' }}"></script>-->

<script defer src="{{ '/assets/js/dist/vntrade.min.js' }}"></script>


<style>
.wide_chart {
    overflow-x: visible;
}
</style>


# Export

(in millions of USD)

<div id="chart_export" class="wide_chart"></div>

# Import

(in millions of USD)

<div id="chart_import" class="wide_chart"></div>

# Notes

- Data source: BACI [HS6 REV. 1992 (1995 - 2022)](https://www.cepii.fr/CEPII/en/bdd_modele/presentation.asp?id=37) via [The Observatory of Economic Complexity](https://oec.world/en/profile/country/vnm)
- Chart source code: customized from [D3 bar chart race on Observable](https://observablehq.com/@d3/bar-chart-race-explained).
- Bar chart race is probably better at visualizing accumulating data than periodic (annual) data like in this case.

---

