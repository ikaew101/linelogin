import html2canvas from 'html2canvas'
import { useContext, useEffect, useState } from 'react';
import { jsPDF } from "jspdf";
import html2pdf from 'html2pdf.js';
import AppContext from '../context/appContext';

export default function ExportTypes({ id, csvData, noBottomStl, optionPDF, single, dataLength, onSaving, img, dataStart, responsive, format }) {
    const [saving, setSaving] = useState(false)
    const callbackSaving = (val) => onSaving ? onSaving(val) : () => { }

    const [dataSrc, setDataSrc] = useState()

    async function downloadJPG() {
        // setStatusSave(`${id}.jpeg`)
        // return
        if (saving)
            setSaving('JPEG')
        await callbackSaving('JPEG')
        const element = document.getElementById(img || id),
            canvas = await html2canvas(element),
            data = canvas.toDataURL('image/jpg'),
            link = document.createElement('a');

        link.href = data;
        link.download = `${id}.jpg`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        callbackSaving(false)
        setSaving(false)
    }
    const { setStatusSave, statusSave } = useContext(AppContext);
    useEffect(() => {
        if (!statusSave) return
        const content = document.getElementById(id)

        var options = {
            jsPDF: { format: format || [354, 500] },
            margin: [7, 0, 8, 0],
            image: { type: "jpeg", quality: 1 }
        };
        // console.log(id, statusSave == `${id}.jpeg`)
        if (statusSave == `${id}.jpeg`) {
            html2pdf().set(options).from(content).outputImg().then(async (data) => {
                const link = document.createElement('a');

                link.href = data.src;
                // link.download = `${id}.jpeg`;
                link.download = statusSave

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setStatusSave(false)
                await callbackSaving(false)
            })
        }
        if (statusSave == `${id}.pdf`) {
            html2pdf().set(options).from(content).toPdf().save(statusSave).then(async () => {
                setStatusSave(false)
                await callbackSaving(false)
            })
        }
    }, [statusSave])

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
    const [dataExport, setDataExport] = useState([])
    useEffect(() => {
        if (csvData) setDataExport(csvData)
    }, [csvData])
    
    async function downloadCSV() {
        // console.log(csvData, dataExport)
        if (saving) return
        await callbackSaving(true)
        setSaving('CSV')
        const datas = csvmaker(dataExport)
        var BOM = "\uFEFF";
        var csvData = BOM + datas;

        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' })
        const url = window.URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.setAttribute('href', url)
        a.setAttribute('download', `${id}.csv`)
        a.click()
        callbackSaving(false)
        setSaving(false)
    }

    async function downloadPDF() {
        // setStatusSave(`${id}.pdf`)
        // // await callbackSaving(true)
        // return
        if (saving) return
        await callbackSaving(true)
        setSaving('PDF')
        const doc = document.getElementById(id);
        const canvas = await html2canvas(doc)

        const pdf = new jsPDF()
     
        var width = pdf.internal.pageSize.getWidth();
        const startH = 10
        const marginL = 5
        let countHt = startH

        if (!single && (csvData || optionPDF == 'cards')) {
            
            const title = doc.querySelector(`#${`title`}`)
            if (title) {
                const canvasT = await html2canvas(title)
                const ratioT = ((width - 10) / canvasT.width)
                const wT = canvasT.width * ratioT
                const hT = canvasT.height * ratioT
                const imgTitle = canvasT.toDataURL('title/jpg')
                pdf.addImage(imgTitle, 'JPEG', marginL, startH, wT, hT)
                countHt += hT
            }

            const th = doc.getElementsByTagName('thead')[0]
            let h = 0, w
            if (th) {
                const thead = await html2canvas(th)
                const canvasThead = thead.toDataURL('image/jpg')
                const ratio = ((width - 10) / thead.width)
                w = thead.width * ratio
                h = thead.height * ratio
                pdf.addImage(canvasThead, 'JPEG', marginL, countHt, w, h)
                countHt += h
            }
            const myRank = document.getElementById("trow_0")
            if (dataStart != 0 && myRank) {
                const canvasM = await html2canvas(myRank)
                const myJPG = canvasM.toDataURL('image/jpg')
                const ratioM = ((width - 10) / canvasM.width)
                const wM = canvasM.width * ratioM
                const hM = canvasM.height * ratioM
                if (hM) pdf.addImage(myJPG, 'JPEG', marginL, countHt, wM, hM)
                countHt += hM
            }

            const dataOfLength = dataStart ? dataStart + dataLength : dataLength

            for (let idx = dataStart || 0; idx <= dataOfLength; idx++) {

                const tr = doc.querySelector(responsive ? `#part${idx}` : `#trow_${idx}`)

                if (tr) {
                    const canvasRow = await html2canvas(tr)
                    let ratio_ = ((width - 10) / canvasRow.width)
                    let margin = 3, x = (idx + 1) % 3, isEven = (idx + 1) % 2, col
                    if (responsive) {
                        if (window.innerWidth < responsive[1]) {
                            col = 2
                            ratio_ = ratio_ / 2
                        } else {
                            col = 3
                            ratio_ = ratio_ / 3
                        }
                    }
                    if (responsive) {
                        if (col == 2) {
                            margin = !isEven ? marginL : 2.5 + pdf.internal.pageSize.getWidth() / 2
                        } else if (col == 3) {
                            if (!x) margin = 2 + pdf.internal.pageSize.getWidth() / 3
                            if (x == 1) margin = 1 + (pdf.internal.pageSize.getWidth() / 3) * 2
                        }
                    }
                    const wt = canvasRow.width * ratio_
                    const ht = canvasRow.height * ratio_
                    const img = canvasRow.toDataURL('image/png')
                    if (countHt + (h ? h : ht) + 8 > pdf.internal.pageSize.getHeight()) {
                        pdf.addPage()
                        countHt = startH
                        // console.log('-------------',idx)
                        if (th) {
                            const thead = await html2canvas(th)
                            const canvasThead = thead.toDataURL('image/jpg')
                            pdf.addImage(canvasThead, 'JPEG', marginL, countHt, w, h)
                            countHt += h
                        }
                    }
                    if (ht && wt) {
                        pdf.addImage(img, 'JPEG', responsive ? margin : marginL, countHt, wt, ht)
                    }
                    if (responsive) {
                        if (col == 3 && x == 1) countHt += ht + 3
                        if (col == 2 && isEven) countHt += ht + 3
                    } else {
                        countHt += ht
                    }

                }
            }
            setSaving(false)
            pdf.save(`${id}.pdf`)
            return

        } else {

            const data = canvas.toDataURL('image/jpg')
            var height = pdf.internal.pageSize.getHeight();

            let ratio = ((width - 5) / canvas.width)
            let wt = canvas.width * ratio
            let ht = canvas.height * ratio
            if (single == "page") {
                ratio = (height / canvas.height)
                wt = canvas.width * ratio
                ht = canvas.height * ratio
                pdf.addImage(data, 'JPEG', 10, 2, wt, ht);
            } else if (optionPDF?.height) {
                const ratioR = (height * optionPDF.height / canvas.height)
                const wR = canvas.width * ratioR
                const hR = canvas.height * ratioR
                const pdfCrop = new jsPDF()
                if (wR > pdfCrop.internal.pageSize.width) {
                    pdfCrop.addImage(data, 'JPEG', 0, 0, wt, ht)
                } else {
                    pdfCrop.addImage(data, 'JPEG', 0, 0, wR, hR)
                }
                pdfCrop.save(`${id}.pdf`);
                return
            } else if (optionPDF == "fit" || !optionPDF) {
                // fit width
                pdf.addImage(data, 'JPEG', 5, 2, wt, ht);
            }
            pdf.save(`${id}.pdf`);
        }
        callbackSaving(false)
        setSaving(false)

    }

    return (
        <div className={`flex w- fit gap-0.5 transition-colors duration-300 px-2 ${!noBottomStl ? "pb-2.5" : ""} group`}
            id="exports">
            <div className={`items-center flex px-1 ${saving && 'group-hover:animate-bounce'}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 20C5.45 20 4.979 19.804 4.587 19.412C4.195 19.02 3.99934 18.5493 4 18V15L5.45455 15V18.5455H18.5455V15L20 15V18C20 18.55 19.804 19.021 19.412 19.413C19.02 19.805 18.5493 20.0007 18 20H6ZM12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16Z" fill="#565E6D" />
                </svg>
            </div>
            <div className={`bg-table-head w-[3.7em] text-center text-xs text-dark font-bold py-1 rounded-l-md cursor-default ${!saving && "cursor-pointer"} ${!csvData && "rounded-r-md"}`}
                onClick={downloadJPG}>
               <span className={`${saving == 'JPEG' && 'animate-pulse'}`}>JPEG</span>
            </div>
             {/* <div className={`bg-table-head w-[3.7em] text-center text-xs text-dark font-bold py-1 ${!csvData && "rounded-r-md"} cursor-pointer
            ${saving && 'cursor-progress'}`}
                onClick={downloadPDF}>
                <span className={`${saving == 'PDF' && 'animate-pulse'}`}>PDF</span>
            </div> */}
            <div hidden={!csvData} className={`bg-table-head w-[3.7em] text-center text-xs text-dark font-bold py-1 rounded-r-md cursor-default ${!saving && "cursor-pointer"}`}
                onClick={downloadCSV}>
                <span className={`${saving == 'CSV' && 'animate-pulse'}`}>CSV</span>
            </div>
        </div>
    )
}