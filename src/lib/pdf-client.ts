"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportPdf() {
  const el = document.getElementById("chart");
  if (!el) return;

  const canvas = await html2canvas(el, { scale: 2 });
  const img = canvas.toDataURL("image/png");

  const pdf = new jsPDF();
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(img, "PNG", 0, 0, width, height);
  pdf.save("organization-chart.pdf");
}
