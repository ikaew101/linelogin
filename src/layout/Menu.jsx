import React,{useState} from 'react'

export default function Menu({navigation}) {

  const [navigationTemp,setNavigationTemp] = useState(navigation)


    const  classNames=(...classes) => {
    return classes.filter(Boolean).join(' ');
    }

    const handleButton = (get_index)=>{

      setNavigationTemp(navigationTemp.map((item,i) =>
        i !== get_index ? {...item, current: false} : {...item, current: true}
      ));
    }


  return (
   
    <div className="grid grid-cols-5 gap-4 p-2 max-[850px]:grid-cols-2">
        {navigation.map((item,index) => (
            <a
            key={item.name}
            href={item.href}
            onClick={()=>(handleButton(index))}
            className={classNames(
                item.current ? 'bg-[#00C2B8] text-white shadow-basic' : 'text-[#828282] bg-white hover:text-[#00C2B8] hover:border-[#00C2B8] hover',
                'rounded-md px-3 py-2 text-sm font-medium border text-center'
            )}
            aria-current={item.current ? 'page' : undefined}
            >
            {item.name}
            </a>
        ))}
    </div>

  )
}
