import {useState, useEffect} from 'react'
import {RecoilValue, useRecoilValueLoadable} from 'recoil'


function useComponentDidMount() {
  const [componentDidMount, setComponentDidMount] = useState(false);
  useEffect(() => {
    setComponentDidMount(true);
  }, []);

  return componentDidMount;
}

export function useRecoilValueAfterMount<T>(
  recoilValue: RecoilValue<T>,
  valueBeforeMount: T,
) {
  const didMount = useComponentDidMount();
  const realValue = useRecoilValueLoadable(recoilValue);

  return didMount ? realValue : valueBeforeMount;
}