import { useEffect, useState } from 'react'
import jwt from 'jwt-decode';
import EnergyYearly from '../../components/energy/PageYearly';
import EnergyDaily from '../../components/energy/PageDaily';
import EnergyRanking from '../../components/energy/PageRanking';
import EnergyKPI from '../../components/KPI/energy';
import useAuthData from '../../context/useAuthData';
import useDropdownStoreFormat from '../../hooks/useDropdownStoreFormat';

function EnergyMonitoring() {
    const stateTab = JSON.parse(localStorage.getItem("tab"))
    const currentIndex = "energy"
    const [state, setState] = useState(stateTab && stateTab[0] == currentIndex && stateTab[1] || 'yearly')
    const [userId, setUserId] = useState('')
    const [selectedStore, setSelectedStore] = useState()
    const [stores, setStores] = useState([])
    const [permission, setPermission] = useState()
    const [formatKpi, setFormatKpi] = useState("");

    const { storeFormatList } = useDropdownStoreFormat()

    const [groupPermission, setGroupPermission] = useState();


    useEffect(() => {
        const authState = localStorage.getItem('_auth_state');
        // setPermission(false)
        setPermission(JSON.parse(authState)[0].menus?.find(ele => ele.menuName.includes('KPI')))
        setGroupPermission(
            JSON.parse(authState)[0].groups?.find(
                (ele) => ele.groupName.includes('FM Manager')
            )?.groupName.includes('FM Manager') !== undefined
        )
        setUserId(JSON.parse(authState)[0].id)
        const jsonStores = JSON.parse(authState)[0].availableStore
        const prevId = localStorage.getItem("_id")
        if (prevId) {
            const prevStore = jsonStores?.mini?.find(ele => ele.id == prevId)
                || jsonStores?.super?.find(ele => ele.id == prevId)
                || jsonStores?.hyper?.find(ele => ele.id == prevId)
            setSelectedStore({
                costCenter: prevStore?.costCenter || "",
                storeNumber: prevStore?.storeNumber || "",
                storeName: prevStore?.storeName || "",
                format: prevStore?.storeFormatName.includes("Mini") ? 'mini' : prevStore?.storeFormatName.includes("Super") ? 'super' : 'hyper'
            })
        } else {
            // if (jsonStores.mini || jsonStores.super || jsonStores.hyper) {
            jsonStores.mini?.sort((a, b) => a.costCenter - b.costCenter)
            jsonStores.super?.sort((a, b) => a.costCenter - b.costCenter)
            jsonStores.hyper?.sort((a, b) => a.costCenter - b.costCenter)
            const select = jsonStores.mini[0] || jsonStores.super[0] || jsonStores.hyper[0]
            setSelectedStore({
                costCenter: select.costCenter || "",
                storeNumber: select.storeNumber || "",
                storeName: select.storeName || "",
                format: jsonStores.mini[0] ? 'mini' : jsonStores.super[0] ? 'super' : jsonStores.hyper[0] && 'hyper'
            })
            // } else {
            //     setSelectedStore({
            //         costCenter: "",
            //         storeNumber: "",
            //         storeName: "",
            //         format: ""
            //     })
            // }
        }
        setStores(jsonStores)

        // const getjwt = localStorage.getItem('_auth');
        // if(authState) {
        //     const decodeToken =  jwt(authState);
        //     console.log(decodeToken)
        // setUserId(decodeToken.userId)
        // }
    }, [])

    useEffect(() => {
        localStorage.setItem("tab", JSON.stringify([currentIndex, state]))
    }, [state])

    function handleGoTabYearly(row) {

        const found = stores?.mini.find((v) => v?.storeNumber === row.storeNumber)
        const found2 = stores?.hyper.find((v) => v?.storeNumber === row.storeNumber)
        const found3 = stores?.super.find((v) => v?.storeNumber === row.storeNumber)

        const getItem = (item) => {
            localStorage.setItem("_id", item.id)
            localStorage.setItem("tab", JSON.stringify(['energy', 'yearly']))
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
        <div className='p-3 mt-5 mb-2' >
            {/* <div id="top"> */}
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between px-4">
                <div className='text-2xl  font-semibold md:pl-6' id="name">
                    ระบบติดตามพลังงาน
                </div>
                {state === 'KPI' &&
                    <div className='w-full max-w-[270px]'>
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
            {/* <div className='bg-primary p-2 my-4 mx-6 rounded-md justify-center flex lg:gap-4 relative z-30 gap-1 max-lg:grid max-lg:grid-cols-4 font-medium'
                    name=""> */}
            <div className={`menus-bar ${permission ? 'menus-4' : 'menus-3'}`}>
                <button name='yearly'
                    className={`${state == 'yearly' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2 rounded-md text-white w-full max-w-[250px] max-lg:mx-auto transition-colors duration-100 font-bold`}
                    onClick={(e) => setState(e.target.name)}>
                    ภาพรวม
                </button>
                <button name='daily'
                    className={`${state == 'daily' && 'bg-[#009B93]'} hover:shadow py-2 hover:bg-[#009B93]/[.8] rounded-md text-white  w-full max-w-[250px]  max-lg:mx-auto transition-colors duration-100 font-bold`}
                    onClick={e => setState(e.target.name)}>
                    รายวัน
                </button>
                <button name='ranking'
                    className={`${state == 'ranking' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2 px-3 rounded-md text-white w-full max-w-[250px] max-lg:mx-auto font-bold transition-colors duration-100`}
                    onClick={e => setState(e.target.name)}>
                    สูงสุด 20 อันดับ
                </button>
                {/* {permission &&
                    <button name='KPI'
                        className={`${state == 'KPI' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2 px-3 rounded-md text-white w-full max-w-[250px] max-lg:mx-auto font-bold transition-colors duration-100`}
                        onClick={e => setState(e.target.name)}>
                        ภาพรวมทุกสาขา
                    </button>
                } */}
                {groupPermission === false && <button name='KPI'
                    className={`${state == 'KPI' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2 px-3 rounded-md text-white w-full max-w-[250px] max-lg:mx-auto font-bold transition-colors duration-100`}
                    onClick={e => setState(e.target.name)}>
                    ภาพรวมทุกสาขา
                </button>
                }
            </div>
            {/* </div> */}

            {selectedStore && <>
                {state == 'yearly' && <EnergyYearly userId={userId} selectedStore={selectedStore} setSelectedStore={setSelectedStore} stores={stores} />}
                {state == 'daily' && <EnergyDaily userId={userId} selectedStore={selectedStore} setSelectedStore={setSelectedStore} stores={stores} />}
                {state == 'ranking' && <EnergyRanking userId={userId} selectedStore={selectedStore} setSelectedStore={setSelectedStore} stores={stores} />}
                {state == 'KPI' && <EnergyKPI userId={userId} selectedStore={selectedStore} setSelectedStore={setSelectedStore} stores={stores} onRowClick={(row) => handleGoTabYearly(row)} formatKpi={formatKpi} />}
            </>
            }
        </div>
    )
}

export default EnergyMonitoring