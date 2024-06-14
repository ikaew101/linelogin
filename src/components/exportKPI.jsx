import { useState } from 'react';
import html2pdf from 'html2pdf.js';

export default function ExportPages({ onSaving, name, csvData, getAllData, onDowloadCSVCustom, onPdfCustom, onJpgCustom, isPdfCustom = false, isJpgCustom = false }) {
  const [saving, setSaving] = useState(false)
  const callbackSaving = (val) => onSaving ? onSaving(val) : () => { }

  async function downloadJPG() {
    const content = document.getElementById('All')
    hiddenSome('none')
    var options = {
      jsPDF: { format: [354, 500] },
      margin: [7, 0, 8, 0],
      image: { type: "jpeg", quality: 1 }
    };

    html2pdf().set(options).from(content).outputImg().then(async (data) => {
      const link = document.createElement('a');

      link.href = data.src;
      link.download = `${name}.jpeg`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      document.querySelector('#export').style.display = ''
      // for (let index = 0; index < document.querySelectorAll('#export').length; index++) {
      //     const div = document.querySelectorAll('#export')[index];
      //     div.style.display = ''
      // }
      hiddenSome('')
    })
  }

  const hiddenSome = (styleDis, isHideText) => {
    for (let index = 0; index < document.querySelectorAll('#export').length; index++) {
      const div = document.querySelectorAll('#export')[index];
      div.style.display = styleDis
    }
    if (isHideText) document.querySelector('#hideText').style.display = styleDis
  }

  async function downloadPDF() {
    const content = document.getElementById('All')
    // document.querySelector('#export').style.display = 'none'
    hiddenSome('none', 'hideText')
    const opt = {
      margin: 1,
      filename: "Test.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };

    var options = {
      jsPDF: { format: [354, 500] },
      margin: [7, 0, 8, 0], // t l b r
      image: { type: "jpeg", quality: 1 }
    };

    html2pdf().set(options).from(content).toPdf().save(`${name}.pdf`).then(() => {
      // document.querySelector('#export').style.display = ''
      hiddenSome('', 'hideText')
    })
  }

  async function downloadCSV() {
    if (saving) return
    await callbackSaving(true)
    setSaving('CSV')
    const res = await getAllData()

    const datas = csvmaker(res)
    var BOM = "\uFEFF";
    var csvData = BOM + datas;

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', `${name}.csv`)
    a.click()
    a.setAttribute('href', '')
    a.setAttribute('download', '')
    callbackSaving(false)
    setSaving(false)
  }

  async function onCustomCsvDowload() {
    await callbackSaving(true)
    setSaving('CSV')
    const done = await onDowloadCSVCustom()
    callbackSaving(false)
    setSaving(false)
  }

  async function onCustomPdfDownload() {
    await callbackSaving(true)
    setSaving('PDF')
    await onPdfCustom()
    callbackSaving(false)
    setSaving(false)
  }

  async function onCustomJpgDownload() {
    await callbackSaving(true)
    setSaving('JPEG')
    await onJpgCustom()
    callbackSaving(false)
    setSaving(false)
  }


  const csvmaker = function (data) {
    const csvRows = [];

    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    data.map(value => {
      const values = Object.values(value).join(',');
      csvRows.push(values)
    })

    return csvRows.join('\n')
  }
  return (
    <div id="export">
      <div className={`flex w-fit gap-0.5 transition-colors duration-300 px-2 pb-2.5 group`} >
        <div className={`items-center flex px-1 ${saving && 'group-hover:animate-bounce'}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 20C5.45 20 4.979 19.804 4.587 19.412C4.195 19.02 3.99934 18.5493 4 18V15L5.45455 15V18.5455H18.5455V15L20 15V18C20 18.55 19.804 19.021 19.412 19.413C19.02 19.805 18.5493 20.0007 18 20H6ZM12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16Z" fill="#565E6D" />
          </svg>
        </div>
        <div className={`bg-table-head w-[3.7em] text-center text-xs text-dark font-bold py-1 rounded-l-md cursor-default ${!saving && "cursor-pointer"} `}
          onClick={isJpgCustom ? onCustomJpgDownload : downloadJPG}>
          <span className={`${saving == 'JPEG' && 'animate-pulse'}`}>JPEG</span>
        </div>
        <div className={`bg-table-head w-[3.7em] text-center text-xs text-dark font-bold py-1 ${!csvData && "rounded-r-md"} cursor-pointer
            ${saving && 'cursor-progress'}`}
          onClick={isPdfCustom ? onCustomPdfDownload : downloadPDF}>
          <span className={`${saving == 'PDF' && 'animate-pulse'}`}>PDF</span>
        </div>
        <div hidden={!csvData} className={`bg-table-head w-[3.7em] text-center text-xs text-dark font-bold py-1 rounded-r-md 
                ${!csvData ? "cursor-default" : !saving && "cursor-pointer"}
                ${saving && 'pointer-events-none'}
                `}
          onClick={onDowloadCSVCustom ? onCustomCsvDowload : downloadCSV}>
          <span className={`${saving == 'CSV' && 'animate-pulse'}`}>CSV</span>
        </div>
      </div>
    </div>
  )
}