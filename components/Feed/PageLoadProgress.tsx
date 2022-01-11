import { styled } from 'stitches.config'
import { useEffect, useState, memo, useRef } from 'react'
import Router from 'next/router'
import * as Progress from '@radix-ui/react-progress';

const StyledProgress = styled(Progress.Root, {
    position: 'fixed',
    top: 0,
    left: 0,
    overflow: 'hidden',
    background: 'transparent',
    borderRadius: '0',
    width: '100vw',
    height: 'calc($1 / 2)',
});

const StyledIndicator = styled(Progress.Indicator, {
    backgroundColor: '$foregroundBronze',
    height: '100%',
    transition: 'width 660ms cubic-bezier(0.65, 0, 0.35, 1)',
});


const PageLoadProgress = () => {
    const [progress, setProgress] = useState(0);
    const loadInterval = useRef<any>(null)

    const routeChangeStart = () => {
        setProgress(10);
        loadInterval.current = setInterval(() => {
            if (progress <= 90) {
                setProgress(progress => progress + 5);
            }
        }, 100);
    };

    const routeChangeEnd = () => {
        setProgress(100);
        setTimeout(() => {
            setProgress(0)
            clearInterval(loadInterval.current)
        }, 1000);
    };


    useEffect((): any => {
        Router.events.on("routeChangeStart", routeChangeStart);
        Router.events.on("routeChangeComplete", routeChangeEnd);
        Router.events.on("routeChangeError", routeChangeEnd);
        return () => {
            Router.events.off("routeChangeStart", routeChangeStart);
            Router.events.off("routeChangeComplete", routeChangeEnd);
            Router.events.off("routeChangeError", routeChangeEnd);
        }
    }, []);

    return (
        <StyledProgress value={66}>
            {progress !== 0 && (
                <StyledIndicator style={{ width: `${progress}%` }} />
            )}
        </StyledProgress>
    )
}

export default memo(PageLoadProgress)