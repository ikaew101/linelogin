import html2canvas from 'html2canvas'
import { useContext, useEffect, useState } from 'react';
import { jsPDF } from "jspdf";
import AppContext from '../context/appContext';
import html2pdf from 'html2pdf.js';

export default function ExportPage({ onSaving, arrayId, name, hasDateOnTop, responsiveWidth, format, saving }) {
    const [savings, setSaving] = useState(false)
    const callbackSaving = (val) => onSaving ? onSaving(val) : () => { }
    const [dataSrc, setDataSrc] = useState("")

    async function downloadJPG() {
        // // เปิดแค่บรรทัด 18,19 จะวิ่งเข้าไปทำงานที่ useEffect
        // // ถ้าจะใช้ lib เดียวกับ exportKPI เพื่อให้ได้รูปที่ค่อนข้างโอเคในขนาดจอปกติ
        // // // น่าจะต้องซ่อนการดาวน์โหลดของจอเล็ก/mobile ไปเลย 
        // // เทสจาก safariมือถือ แล้วไม่ work 

        // setStatusSave('pageJPEG')
        // return

        // ส่วนล่างนี้ ทำงานในมือถือได้ แต่บางทีอาจติด permission เรื่องโหลดรูปของ safari..
        // ติด*ในส่วนของการดาวน์โหลด จะเป็นการแคปรูป 
        //// จอเล็กๆ/มือถือ จะได้รูปส่วนของตารางไม่ครบ
        if (saving) return
        await callbackSaving('JPEG')
        setSaving('JPEG')
        const element = document.getElementById("All"),
            canvas = await html2canvas(element),
            data = canvas.toDataURL('image/jpg'),
            link = document.createElement('a');

        link.href = data;
        link.download = `${name}.jpg`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        callbackSaving(false)
        setSaving(false)
    }

    const { setStatusSave, statusSave } = useContext(AppContext);
    useEffect(() => {
        if (!statusSave) return
        const content = document.getElementById('All')
        setButtonStyle('none')

        var options = {
            jsPDF: { format: format || [354, 500] },
            margin: [7, 0, 8, 0],
            image: { type: "jpeg", quality: 1 }
        };
        if (statusSave == 'pageJPEG') {
            html2pdf().set(options).from(content).outputImg().then(async (data) => {
                const link = document.createElement('a');

                link.href = data.src;
                link.download = `${name}.jpeg`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setButtonStyle('')
                setStatusSave(false)
                await callbackSaving(false)
            })
        } else if (statusSave == 'pagePDF') {
            html2pdf().set(options).from(content).toPdf().save(`${name}.pdf`).then(async () => {
                setButtonStyle('')
                setStatusSave(false)
                await callbackSaving(false)
            })
        }
    }, [statusSave])

    const setButtonStyle = (value) => {
        for (let i = 0; i < document.querySelectorAll('#exports').length; i++) {
            document.querySelectorAll('#exports')[i].style.display = value
        }
    }

    async function downloadPDF() {
        // เปิดบรรทัด 85-87 จะเป็น lib เดียวกับตัว exportKPI
        //// problem เดียวกับ downloadJPG
        // setStatusSave('pagePDF')
        // await callbackSaving(true)
        // return

        // ติด*ในส่วนของการดาวน์โหลด ใช้เวลานาน เนื่องจากจะเก็บทีละ component มาต่อกัน และคิดเรื่องการแบ่งหน้า
        // // จอเล็กๆ/มือถือ จะได้รูปส่วนของตารางไม่ครบ
        if (saving) return
        // const docs = document.getElementById("PDF");
        setSaving('PDF')
        const pdf = new jsPDF()
        var width = pdf.internal.pageSize.getWidth();
        var height = pdf.internal.pageSize.getHeight();
        const startH = 10
        const marginL = 5
        let countHt = startH

        const top = document.getElementById("top");
        const canvasT = await html2canvas(top)

        const imgName = canvasT.toDataURL('name/jpg')
        const ratioT = ((width - 10) / canvasT.width)
        const wT = canvasT.width * ratioT
        const hT = canvasT.height * ratioT


        pdf.addImage(imgName, 'JPEG', marginL, startH, wT, hT)
        countHt += hT + 5

        const page = document.getElementById('page')

        const dataOfLength = arrayId?.start ? arrayId?.start + arrayId?.length : arrayId?.length

        for (let idx = arrayId?.start || 0; idx < dataOfLength; idx++) {
            if (arrayId[idx].table || arrayId[idx].card) {
                const doc = document.getElementById(`table${arrayId[idx].table}`) || document.getElementById(arrayId[idx].card)
                const isRefrig = name.startsWith("Refrig")

                const title = doc.querySelector(`#${`title`}`)
                if (title) {
                    const canvasT = await html2canvas(title)
                    const ratioT = ((width - 10) / canvasT.width)
                    const wT = canvasT.width * ratioT
                    const hT = canvasT.height * ratioT
                    const imgTitle = canvasT.toDataURL('title/jpg')
                    if (countHt + hT + 8 > height) {
                        console.log('add_T')
                        pdf.addPage()
                        countHt = startH
                    }
                    pdf.addImage(imgTitle, 'JPEG', marginL, countHt, wT, hT)
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
                const value = arrayId[idx]
                const row = value.start ? value.start + +value.length : value.length || 30
                const iStart = value.start || 0
                for (let idx = iStart; idx < row; idx++) {
                    const tr = doc.querySelector(`#trow_${idx}`)

                    if (tr) {
                        const canvasRow = await html2canvas(tr)
                        const ratio_ = ((width - 10) / canvasRow.width)
                        const wt = canvasRow.width * ratio_
                        const ht = canvasRow.height * ratio_
                        const img = canvasRow.toDataURL('image/png')
                        if (countHt + (h ? h : ht) + 8 > pdf.internal.pageSize.getHeight()) {
                            pdf.addPage()
                            countHt = startH
                            // console.log('-------------')
                        }
                        if (ht && wt) {
                            pdf.addImage(img, 'JPEG', marginL, countHt, wt, ht)
                        }
                        countHt += ht
                    }
                }

            } else if (!arrayId[idx]?.parts) {
                // console.log(idx, arrayId[idx])

                const part = document.getElementById(`${arrayId[idx]}`)

                if (part) {
                    const canvasRow = await html2canvas(part)
                    const ratio_ = ((width - 10) / canvasRow.width)
                    const wt = canvasRow.width * ratio_
                    const ht = canvasRow.height * ratio_
                    const img = canvasRow.toDataURL('image/png')
                    if (countHt + ht + 8 > pdf.internal.pageSize.getHeight()) {
                        // console.log('-------------')
                        pdf.addPage()
                        countHt = startH
                    }
                    if (ht && wt) {
                        pdf.addImage(img, 'JPEG', marginL, countHt, wt, ht)
                    }
                    countHt += ht
                }

            } else {
                let parts = document.getElementById(arrayId[idx]?.parts), widthBefore = 0
                const title = parts?.querySelector(`#${`title`}`)
                if (title) {
                    const canvasT = await html2canvas(title)
                    const ratioT = ((width - 10) / canvasT.width)
                    const wT = canvasT.width * ratioT
                    const hT = canvasT.height * ratioT
                    const imgTitle = canvasT.toDataURL('title/jpg')
                    if (countHt + hT + 8 > height) {
                        console.log('add_T')
                        pdf.addPage()
                        countHt = startH
                    }
                    pdf.addImage(imgTitle, 'JPEG', marginL, countHt, wT, hT)
                    countHt += hT
                }
                const length = arrayId[idx]?.length === "0" ? 1 : arrayId[idx]?.length
                for (let i = 1; i <= length; i++) {
                    // console.log(i, arrayId[idx]?.id[i - 1])
                    let tr = parts?.querySelector(`#part${i}`), ratio_, isEven, seperate

                    const isSpecId = arrayId[idx]?.id
                    if (isSpecId) tr = document.getElementById(arrayId[idx]?.id[i - 1])
                    // console.log(isSpecId[i-1],i,tr, document.getElementById(isSpecId[i - 1]))
                    if (tr) {
                        const canvasRow = await html2canvas(tr)
                        ratio_ = ((width - 10) / canvasRow.width)

                        isEven = (i + 1) % 2
                        if (isSpecId) {

                            if (window.innerWidth < responsiveWidth) {
                                // console.log('one')
                                seperate = true
                            } else {
                                console.log('two')
                                ratio_ = ratio_ / 2
                            }
                        }

                        const ratioHalfPage = (pdf.internal.pageSize.getHeight() - 20) / 2 / canvasRow.height
                        if (seperate) {
                            if (!(ratioHalfPage * canvasRow.width > pdf.internal.pageSize.getWidth())) ratio_ = ratioHalfPage
                        }
                        const arrResponsive = arrayId[idx]?.responsive
                        let col = 1
                        if (arrResponsive) {
                            if (arrayId[idx]?.length === "0" || window.innerWidth < arrResponsive[0]) {
                                // col 1  ไม่พบข้อมูล
                            } else if (window.innerWidth < arrResponsive[1]) {
                                col = 2
                                ratio_ = ratio_ / 2
                            } else {
                                col = 3
                                ratio_ = ratio_ / 3
                            }
                        }
                        const wt = canvasRow.width * ratio_
                        const ht = canvasRow.height * ratio_

                        const img = canvasRow.toDataURL('image/png')
                        if (countHt + ht + 8 > pdf.internal.pageSize.getHeight()) {
                            // console.log('-------------')
                            pdf.addPage()
                            countHt = startH

                        }

                        let margin = col == 3 ? 3 : 5, x = (i + 1) % 3
                        if (arrResponsive) {
                            if (col == 2) {
                                margin = !isEven ? marginL : 2.5 + pdf.internal.pageSize.getWidth() / 2
                            } else if (col == 3) {
                                if (!x) margin = 2 + pdf.internal.pageSize.getWidth() / 3
                                if (x == 1) margin = 1 + (pdf.internal.pageSize.getWidth() / 3) * 2
                            }
                        }
                        // if (ht && wt) {
                        pdf.addImage(img, 'JPEG', arrResponsive ? margin : !isSpecId ? marginL : seperate ? marginL : !isEven ? marginL : 2.5 + pdf.internal.pageSize.getWidth() / 2, countHt, wt, ht)
                        // }
                        if (arrResponsive) {
                            if (arrayId[idx]?.length === "0") {
                                countHt += ht + 5

                            } else if (col == 3 && x == 1) {
                                countHt += ht + 3
                            } else if (col == 2 && isEven) {
                                countHt += ht + 3
                            } else if (col == 1 || i == arrayId[idx]?.length) {
                                countHt += ht + 5

                            }
                        } else if (!isSpecId) {
                            countHt += ht
                        } else if (seperate || isEven) {
                            countHt += ht
                        }
                    }
                }
            }
        }

        callbackSaving(false)
        setSaving(false)
        pdf.save(`${name}.pdf`)

    }

    return (
        <>
            <div className={`flex w-fit gap-0.5 transition-colors duration-300 px-2 pb-2.5 group`}
                id="exports">
                <div className={`items-center flex px-1 ${saving && 'group-hover:animate-bounce'}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 20C5.45 20 4.979 19.804 4.587 19.412C4.195 19.02 3.99934 18.5493 4 18V15L5.45455 15V18.5455H18.5455V15L20 15V18C20 18.55 19.804 19.021 19.412 19.413C19.02 19.805 18.5493 20.0007 18 20H6ZM12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16Z" fill="#565E6D" />
                    </svg>
                </div>
                <div className={`bg-table-head w-[3.7em] text-center text-xs text-dark font-bold py-1 rounded-l-md cursor-default ${!saving && "cursor-pointer"} rounded-r-md`}
                    onClick={downloadJPG}>
                    <span className={`${saving == 'JPEG' && 'animate-pulse'}`}>JPEG</span>
                </div>
                {/* <div className={`bg-table-head w-[3.7em] text-center text-xs text-dark font-bold py-1 rounded-r-md cursor-pointer
            ${saving && 'cursor-progress'}`}
                    onClick={downloadPDF}>
                    <span className={`${saving == 'PDF' && 'animate-pulse'}`}>PDF</span>
                </div> */}
            </div>

            <div className='h-0 overflow-hidden' >
                <hr id="hr" className='w-full mx-2' />
            </div>
        </>
    )
}