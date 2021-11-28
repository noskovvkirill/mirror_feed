import {useState, useEffect} from 'react'
import {RecoilValue, useRecoilValue} from 'recoil'

//useRecoilValueAfterMount but made for the recoil family

function useComponentDidMount() {
  const [componentDidMount, setComponentDidMount] = useState(false);
  useEffect(() => {
    setComponentDidMount(true);
  }, []);

  return componentDidMount;
}


export function useRecoilValueAfterMount<T>(
  recoilValue: (id:number)=>RecoilValue<T>,
  valueBeforeMount: T,
  id:number
) {
  const didMount = useComponentDidMount();
  const realValue = useRecoilValue(recoilValue(id))

  return didMount ? realValue : valueBeforeMount;
}