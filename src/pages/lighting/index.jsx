import { useEffect, useState } from 'react'
import LightingDaily from '../../components/lighting/PageDaily'
import LightingResult from '../../components/lighting/PageResult'
import LightingOverall from '../../components/lighting/PageOverall'
import LightingKPI from '../../components/KPI/lighting'
import useDropdownStoreFormat from '../../hooks/useDropdownStoreFormat'

function Lighting({ tab }) {
    const stateTab = JSON.parse(localStorage.getItem("tab"))
    const currentIndex = "lighting"
    const [state, setState] = useState(stateTab && stateTab[0] == currentIndex && stateTab[1] || 'overall')
    const [selectedStore, setSelectedStore] = useState()
    const [formatKpi, setFormatKpi] = useState("");

    useEffect(() => {
        localStorage.setItem("tab", JSON.stringify([currentIndex, state]))
    }, [state])

    const [stores, setStores] = useState([])
    const authState = localStorage.getItem('_auth_state')
    let userId = JSON.parse(authState)[0]?.id
    const [permission, setPermission] = useState()

    const { storeFormatList } = useDropdownStoreFormat()

    const [groupPermission, setGroupPermission] = useState();


    useEffect(() => {
        setPermission(JSON.parse(authState)[0].menus?.find(ele => ele.menuName.includes('KPI')))
        setGroupPermission(
            JSON.parse(authState)[0].groups?.find(
                (ele) => ele.groupName.includes('FM Manager')
            )?.groupName.includes('FM Manager') !== undefined
        )
        const jsonStores = JSON.parse(authState)[0].availableStore
        const prevId = localStorage.getItem("_id")
        let selectStore
        if (prevId) {
            selectStore = jsonStores?.mini?.find(ele => ele.id == prevId)
                || jsonStores?.super?.find(ele => ele.id == prevId)
                || jsonStores?.hyper?.find(ele => ele.id == prevId)
        } else {
            jsonStores.mini?.sort((a, b) => a.costCenter - b.costCenter)
            jsonStores.super?.sort((a, b) => a.costCenter - b.costCenter)
            jsonStores.hyper?.sort((a, b) => a.costCenter - b.costCenter)
            selectStore = jsonStores.mini[0] || jsonStores.super[0] || jsonStores.hyper[0]
        }
        setStores(jsonStores)
        setSelectedStore({
            costCenter: selectStore.costCenter,
            storeNumber: selectStore.storeNumber,
            storeName: selectStore.storeName,
            format: selectStore.storeFormatName.includes("Mini") ? 'mini'
                : selectStore.storeFormatName.includes("Super") ? 'super'
                    : selectStore.storeFormatName.includes("Hyper") ? 'hyper' : 'mini'
        })
    }, [])


    function handleGoTabOverall(row) {

        const found = stores?.mini.find((v) => v?.storeNumber === row.storeNumber)
        const found2 = stores?.hyper.find((v) => v?.storeNumber === row.storeNumber)
        const found3 = stores?.super.find((v) => v?.storeNumber === row.storeNumber)

        const getItem = (item) => {
            localStorage.setItem("_id", item.id)
            localStorage.setItem("tab", JSON.stringify(['lighting', 'overall']))
            window.location.reload()
            window.scrollTo(0, 0)
        }
        if (found) {
            getItem(found)
        }
        else if (found2) {
            getItem(found2)
        }
        else if (found3) {
            getItem(found3)
        }
    }

    return (
        <div className='p-3 mt-5 mb-3'>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between px-4">
                <div className='text-2xl  font-semibold md:pl-6' id="name">
                    ระบบแสงสว่าง
                </div>
                {state === 'KPI' && <div className='w-full max-w-[270px]'>
                    <div>ประเภทสาขา</div>
                    <div>
                        <select
                            className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer outline-0 h-[2.5em] bg-white"
                            value={formatKpi}
                            onChange={(e) => setFormatKpi(e.target.value)}
                        >
                            <option value="">All</option>
                            {storeFormatList.map((item) => <option key={item.id} value={item.value}>{item.label}</option>)}
                        </select>
                    </div>
                </div>}
            </div>
            <div className={`bg-primary p-2 my-4 mx-6 rounded-md justify-center flex lg:gap-4 relative z-30 gap-1 font-medium
            ${permission ? 'menus-3' : 'grid-cols-2 max-sm:grid md:gap-4'}`}>
                {/* className='bg-primary p-2 my-4 mx-6  rounded-md justify-center flex lg:gap-4 relative z-30 gap-1 max-lg:grid max-lg:grid-cols-4 font-medium'> */}
                <button name='overall'
                    className={`${state == 'overall' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2 rounded-md text-white w-full max-w-[250px] max-md:mx-auto transition-colors duration-100 font-bold`}
                    onClick={(e) => setState(e.target.name)}>
                    ภาพรวม
                </button>
                <button name='daily'
                    className={`${state == 'daily' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2 rounded-md text-white w-full max-w-[250px] max-md:mx-auto transition-colors duration-100 font-bold`}
                    onClick={e => setState(e.target.name)}>
                    รายวัน
                </button>
                {/* <button name='result' disabled
                    className={`${state == 'result' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2  rounded-md text-white w-full  max-w-[250px]    px-2 transition-colors duration-100 font-bold`}
                    onClick={e => setState(e.target.name)}>
                    ผลสรุป
                </button> */}
                {/* {permission &&
                    <button name='KPI'
                        className={`${state == 'KPI' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2 px-3 rounded-md text-white w-full  max-w-[250px] font-bold`}
                        onClick={e => setState(e.target.name)}>
                        ภาพรวมทุกสาขา
                    </button>
                } */}
                {groupPermission === false && <button name='KPI'
                    className={`${state == 'KPI' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2 px-3 rounded-md text-white w-full  max-w-[250px] font-bold`}
                    onClick={e => setState(e.target.name)}>
                    ภาพรวมทุกสาขา
                </button>
                }
            </div>
            {selectedStore && <>
                {state == 'overall' && <LightingOverall selectedStore={selectedStore} setSelectedStore={setSelectedStore} stores={stores} userId={userId} />}
                {state == 'daily' && <LightingDaily selectedStore={selectedStore} setSelectedStore={setSelectedStore} stores={stores} userId={userId} />}
                {/* {state == 'result' && <LightingResult selectedStore={selectedStore} setSelectedStore={setSelectedStore} stores={stores} userId={userId} />} */}
                {state == 'KPI' && <LightingKPI userId={userId} selectedStore={selectedStore} setSelectedStore={setSelectedStore} stores={stores} onRowClick={(row) => handleGoTabOverall(row)} formatKpi={formatKpi} />}
            </>}
        </div>
    )
}

export default Lighting