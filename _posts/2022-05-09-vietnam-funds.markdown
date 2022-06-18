---
layout: "custom-funds"
title:  "Performance dashboard of open-ended funds in Vietnam"
date:   2022-06-18 11:02:20 +0700
categories: [blog, finance]
tags: [d3.js, finance, data visualization, vietnam]
---

<script defer src="https://d3js.org/d3.v7.min.js"></script>
<script defer src="{{ '/assets/js/custom/main.js' }}"></script>


<style>
.wide_chart {
    overflow-x: visible;
}
@media all and (max-width: 849px) {
    .wide_chart {
        overflow-x: auto;
    }
}
</style>



<div class="wide_chart">
<!-- <div id="chart_navps" class="tw-w-fit tw-m-auto tw--ml-5"></div> -->
<div id="chart_cr" class="tw-w-fit tw-m-auto tw--ml-5"></div>
</div>


**I started working on this chart as a simple line chart, just to introduce myself to D3.js. Since then I've kept thinking of new features and the code has growth much larger than just a small "Hello World".**

---

This chart shows the cumulative return and CAGR of most open-ended funds in Vietnam. The funds can be roughly classified into 3 categories:

- Active funds: equity funds that are actively managed. This includes both stock funds and balanced funds (funds that invest in both stocks and bonds).
- Index funds: equity funds that track an index (e.g. VNINDEX). Technically, not all index funds are ETFs, but in Vietnam they are.
- Fixed income funds: funds that invest in fixed income securities, like bonds or certificates of deposit.

---

Trên đồ thị là cumulative return (Tổng lợi tức) và CAGR (Mức tăng trưởng kép hàng năm) của các quỹ mở ở Việt Nam. Các quỹ được chia thành 3 nhóm:

- Quỹ chủ động (active fund): các quỹ được quản lý một cách chủ động bao gồm cả quỹ cổ phiếu và quỹ cân bằng (đầu tư cả cổ phiếu và trái phiếu).
- Quỹ chỉ số (index fund): các quỹ có danh mục dựa theo một chỉ số nào đó như VNINDEX. Hiện ở Việt Nam, các quỹ chỉ số chính là các quỹ ETF.
- Quỹ thu nhập cố định (fixed income fund): các quỹ chuyên đầu tư vào các loại tài sản thu nhập cố định như trái phiếu hay chứng chỉ tiền gửi.

