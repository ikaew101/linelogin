import { useEffect, useState } from 'react'
import RefrigerationOverall from '../../components/refrigeration/RefrigerationOverall'
import RefrigerationGraph from '../../components/refrigeration/RefrigerationGraph'
import NotificationPage from '../../components/refrigeration/Notification'
import RefrigKPI from '../../components/KPI/refrig'
import { useLocation, useNavigate } from 'react-router-dom'
import useDropdownStoreFormat from '../../hooks/useDropdownStoreFormat'

function RefrigerationMonitoring({ tab }) {
    const stateTab = JSON.parse(localStorage.getItem("tab"))
    const currentIndex = "refrig"
    const [state, setState] = useState(stateTab && stateTab[0] == currentIndex && stateTab[1] || 'overall')
    const [valueCallback, setvalueCallback] = useState('')
    const [selectedStore, setSelectedStore] = useState()
    const [formatKpi, setFormatKpi] = useState("");

    function toGraphPage(flag) {
        setvalueCallback(flag)
        return
    }

    function toGraphSelect(id) {
        setvalueCallback({ graphId: id })
    }

    useEffect(() => {
        if (valueCallback) setState('graph')
    }, [valueCallback])

    useEffect(() => {
        if (state != 'graph' && valueCallback) {
            setvalueCallback('')
        }
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
            costCenter: selectStore?.costCenter,
            storeNumber: selectStore?.storeNumber,
            storeName: selectStore?.storeName,
            format: selectStore?.storeFormatName.includes("Mini") ? 'mini'
                : selectStore?.storeFormatName.includes("Super") ? 'super'
                    : selectStore?.storeFormatName.includes("Hyper") ? 'hyper' : 'mini'
        })

        // const getjwt = localStorage.getItem('_auth');
        // if(authState) {
        //     const decodeToken =  jwt(authState);
        // setUserId(decodeToken.userId)
        // }
    }, [])

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);


    function handleTab(row, isToggleWork, tab) {
        const found = stores?.mini.find((v) => v?.storeNumber === row.storeNumber)
        const found2 = stores?.hyper.find((v) => v?.storeNumber === row.storeNumber)
        const found3 = stores?.super.find((v) => v?.storeNumber === row.storeNumber)

        if (isToggleWork) {
            queryParams.set("toggleWork", true);
            navigate({ search: queryParams.toString() });
        } else {
            navigate({});
        }
        const getItem = (item) => {
            localStorage.setItem("_id", item.id)
            localStorage.setItem("tab", JSON.stringify(['refrig', tab]))
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
        <div className='p-3 mt-5 mb-3'
        // id="All"
        >
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between px-4">
                <div className='text-2xl  font-semibold md:pl-6' id="name">
                    ระบบตู้แช่และห้องเย็น
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
            <div className={`menus-bar ${permission ? 'menus-4' : 'menus-3'}`}>
                <button name='overall'
                    className={`${state == 'overall' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2 rounded-md text-white w-full max-w-[250px] max-lg:mx-auto transition-colors duration-100 font-bold`}
                    onClick={(e) => setState(e.target.name)}>
                    ภาพรวม
                </button>
                <button name='graph'
                    className={`${state == 'graph' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2 rounded-md text-white w-full max-w-[250px] max-lg:mx-auto transition-colors duration-100 font-bold`}
                    onClick={e => setState(e.target.name)}>
                    กราฟ
                </button>
                <button name='notification'
                    className={`${state == 'notification' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2  rounded-md text-white w-full max-w-[250px] max-lg:mx-auto px-2 transition-colors duration-100 font-bold`}
                    onClick={e => setState(e.target.name)}>
                    การแจ้งเตือน
                </button>
                {/* {permission &&
                    <button name='KPI'
                        className={`${state == 'KPI' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2 px-1.5 rounded-md text-white w-full max-w-[250px] max-lg:mx-auto font-bold`}
                        onClick={e => setState(e.target.name)}>
                        ภาพรวมทุกสาขา
                    </button>
                } */}
                {groupPermission === false && <button name='KPI'
                    className={`${state == 'KPI' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2 px-1.5 rounded-md text-white w-full max-w-[250px] max-lg:mx-auto font-bold`}
                    onClick={e => setState(e.target.name)}>
                    ภาพรวมทุกสาขา
                </button>
                }
            </div>
            {selectedStore && <>
                {state == 'overall' && <RefrigerationOverall toGraphPage={toGraphPage} toGraphSelect={toGraphSelect} selectedStore={selectedStore} setSelectedStore={setSelectedStore} stores={stores} userId={userId} />}
                {state == 'graph' && <RefrigerationGraph values={valueCallback} selectedStore={selectedStore} setSelectedStore={setSelectedStore} stores={stores} userId={userId} />}
                {state == 'notification' && <NotificationPage selectedStore={selectedStore} setSelectedStore={setSelectedStore} stores={stores} userId={userId} />}
                {state == 'KPI' && <RefrigKPI userId={userId} selectedStore={selectedStore} setSelectedStore={setSelectedStore} stores={stores} onRowClick={(row, isToggleWork, tab) => handleTab(row, isToggleWork, tab)} formatKpi={formatKpi} />}
            </>}
        </div>
    )
}

export default RefrigerationMonitoring