import React, {useEffect, useState} from "react";
import {Icon} from "antd";

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1621723_nxskn8qttc.js',
    extraCommonProps: {
        style: {
            color: '#ffffff',
        }
    }
});

const PhotoGallery = ({data}) => {

    const [showIndex, setShowIndex] = useState(data[0].id);
    const [timer, setTimer] = useState(null);
    const [length] = useState(data[0].id + data.length);

    const stop = () => { //暂停
        clearInterval(timer);
    };
    const start = () => { //开始
        setTimer(setInterval(() => {
            next();
        }, 2000));
    };

    useEffect(() => {
        start();
        return function cleanup() {
            stop();
            start()
        }
    }, []);

    const change = (index) => { //点击下面的按钮切换当前显示的图片
        setShowIndex(index)
    };
    const previous = () => { //上一张
        if (showIndex <= data[0].id) {
            setShowIndex(length - 1);
        } else {
            setShowIndex(showIndex - 1);
        }
    };

    const next = () => { //下一张
        if (showIndex >= length - 1) {
            setShowIndex(data[0].id);
        } else {
            setShowIndex(showIndex + 1);
        }
    };

    // console.log(data, length);

    return (
        <div className="ReactCarousel">
            <div className="contain"
                 onMouseEnter={() => {
                     stop()
                 }} //鼠标进入停止自动播放
                 onMouseLeave={() => {
                     start()
                 }}  //鼠标退出自动播放
            >
                <ul className="ul">
                    {
                        data.map(item => {
                            return (
                                <li className={item.id === showIndex ? 'show' : ''}
                                    key={item.id}
                                >
                                    <img src={item.photo} alt="轮播图"/>
                                </li>
                            )
                        })
                    }
                </ul>
                <ul className="dots">
                    {
                        data.map(item => {
                            return (
                                <li key={item.id}
                                    className={item.id === showIndex ? 'active' : ''}
                                    onClick={() => {
                                        change(item.id)
                                    }}>
                                </li>)
                        })
                    }

                </ul>
                <div className="control">
                    <span className="left" onClick={(e) => {
                        previous(e)
                    }}><IconFont type="iconarrow-left"/></span>
                    <span className="right" onClick={(e) => {
                        next(e)
                    }}><IconFont type="iconright"/></span>
                </div>
            </div>
        </div>
    )

};

export default PhotoGallery