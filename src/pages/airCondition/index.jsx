import { useEffect, useState } from 'react'
import AirOverall from '../../components/airSystem/PageOverall'
import AirDailyPage from '../../components/airSystem/PageDaily'
import AirNotification from '../../components/airSystem/PageNotification'
import AirResult from '../../components/airSystem/PageResult'
import AirKPI from '../../components/KPI/air'
import useDropdownStoreFormat from '../../hooks/useDropdownStoreFormat';

function AirCondition({ tab }) {
    const stateTab = JSON.parse(localStorage.getItem("tab"))
    const currentIndex = "air"
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

    const [groupPermission, setGroupPermission] = useState();

    const { storeFormatList } = useDropdownStoreFormat()


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
            selectStore = jsonStores.mini?.find(ele => ele.id == prevId)
                || jsonStores.super?.find(ele => ele.id == prevId)
                || jsonStores.hyper?.find(ele => ele.id == prevId)
        } else {
            jsonStores.mini?.sort((a, b) => a.costCenter - b.costCenter)
            jsonStores.super?.sort((a, b) => a.costCenter - b.costCenter)
            jsonStores.hyper?.sort((a, b) => a.costCenter - b.costCenter)
            selectStore = jsonStores.mini[0] || jsonStores.super[0] || jsonStores.hyper[0]
        }
        setStores(jsonStores)
        setSelectedStore({
            costCenter: selectStore?.costCenter || "",
            storeNumber: selectStore?.storeNumber || "",
            storeName: selectStore?.storeName || "",
            format: selectStore?.storeFormatName.includes("Mini") ? 'mini'
                : selectStore?.storeFormatName.includes("Super") ? 'super'
                    : selectStore?.storeFormatName.includes("Hyper") ? 'hyper' : 'mini'
        })
    }, [])

    useEffect(() => {
        console.log(groupPermission)
    }, [groupPermission]);

    function handleGoTabOverall(row) {
        const getItem = (item) => {
            localStorage.setItem("_id", item.id)
            localStorage.setItem("tab", JSON.stringify(['air', 'overall']))
            window.location.reload()
            window.scrollTo(0, 0)
        }
        // for tab Chiller Type
        if (row?.storeInfo) {
            const found = stores?.mini.find((v) => v?.storeNumber === row.storeInfo.storeNumber)
            const found2 = stores?.hyper.find((v) => v?.storeNumber === row.storeInfo.storeNumber)
            const found3 = stores?.super.find((v) => v?.storeNumber === row.storeInfo.storeNumber)
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
        // for tab Split type
        else {
            const found = stores?.mini.find((v) => v?.storeNumber === row.storeNumber)
            const found2 = stores?.hyper.find((v) => v?.storeNumber === row.storeNumber)
            const found3 = stores?.super.find((v) => v?.storeNumber === row.storeNumber)
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
    }

    return (
        <div className='p-3 mt-5 mb-3'>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between px-4">
                <div className='text-2xl  font-semibold md:pl-6' id="name">
                    ระบบปรับอากาศ
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
            {/* <div className='bg-primary p-2 my-4 mx-6 lg:mx- 10 rounded-md justify-center flex lg:gap-4 relative z-30 gap-1 max-lg:grid max-lg:grid-cols-5 font-bold'> */}
            {/* <div className={`menus-bar font-bold ${permission ? 'menus-5' : 'menus-4'}`}> */}
            <div className={`menus-bar font-bold ${permission ? 'menus-4' : 'menus-3'}`}>
                <button name='overall'
                    className={`${state == 'overall' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2 rounded-md text-white w-full max-w-[250px]    max-lg:mx-auto transition-colors duration-100`}
                    onClick={(e) => setState(e.target.name)}>
                    ภาพรวม
                </button>
                <button name='daily'
                    className={`${state == 'daily' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2 rounded-md text-white w-full max-w-[250px]   max-lg:mx-auto transition-colors duration-100`}
                    onClick={e => setState(e.target.name)}>
                    รายวัน
                </button>
                <button name='notification'
                    className={`${state == 'notification' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2  rounded-md text-white w-full max-w-[250px]    px-2 transition-colors duration-100 `}
                    onClick={e => setState(e.target.name)}>
                    การแจ้งเตือน
                </button>
                {/* <button name='result' disabled
                    className={`${state == 'result' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2  rounded-md text-white w-full max-w-[250px]    px-2 transition-colors duration-100 `}
                    onClick={e => setState(e.target.name)}>
                    ผลสรุป
                </button> */}
                {/* {permission &&
                    <button name='KPI'
                        className={`${state == 'KPI' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2  rounded-md text-white w-full max-w-[250px]    px-2 transition-colors duration-100 `}
                        onClick={e => setState(e.target.name)}>
                        ภาพรวมทุกสาขา
                    </button>
                } */}
                {groupPermission === false && <button name='KPI'
                    className={`${state == 'KPI' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2  rounded-md text-white w-full max-w-[250px]    px-2 transition-colors duration-100 `}
                    onClick={e => setState(e.target.name)}>
                    ภาพรวมทุกสาขา
                </button>}
            </div>
            {selectedStore && <>
                {state == 'overall' && <AirOverall selectedStore={selectedStore} setSelectedStore={setSelectedStore} stores={stores} userId={userId} />}
                {state == 'daily' && <AirDailyPage selectedStore={selectedStore} setSelectedStore={setSelectedStore} stores={stores} userId={userId} />}
                {state == 'notification' && <AirNotification selectedStore={selectedStore} setSelectedStore={setSelectedStore} stores={stores} userId={userId} />}
                {state == 'result' && <AirResult selectedStore={selectedStore} setSelectedStore={setSelectedStore} stores={stores} userId={userId} />}
                {state == 'KPI' && <AirKPI selectedStore={selectedStore} setSelectedStore={setSelectedStore} stores={stores} userId={userId} onRowClick={(row) => handleGoTabOverall(row)} formatKpi={formatKpi} />}
            </>}
        </div>
    )
}

export default AirCondition