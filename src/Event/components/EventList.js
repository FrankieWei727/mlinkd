import React from "react";
import {Icon, List} from "antd";

const briefLength = 350;
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1621723_jqgxq54ls7o.js'
});

const EventList = ({item}) => {

    const extractText = HTMLString => {
        let span = document.createElement("span");
        span.innerHTML = HTMLString;
        return span.textContent || span.innerText;
    };
    const extractBrief = HTMLString => {
        const text = extractText(HTMLString);
        // const text = HTMLString;
        if (text.length > briefLength) {
            return text.slice(0, briefLength) + "……";
        }
        return text;
    };

    return (
        <List.Item
            style={{borderBottom: "none", borderTop: "1px solid #e8e8e8"}}
            key={item.title}
            actions={[
                <span>
                        <IconFont type="icondizhi" style={{marginRight: 8}}/>
                    {item.location}
                    </span>,
                <span>
                        <IconFont type="iconColor-Caption" style={{marginRight: 8}}/>
                    {item.start_date} to {item.end_date}
                    </span>,
            ]}
            extra={
                <img
                    width={272}
                    alt="logo"
                    src={item.poster}
                    style={{width: "135px",}}
                />
            }>
            <List.Item.Meta
                title={<a href={'/event/' + item.id}>{item.title}</a>}
            />
            <div className='braft-output-content' style={{overflow: 'auto'}}
                 dangerouslySetInnerHTML={{__html: extractBrief(item.content)}}/>
        </List.Item>
    )
};

export default EventList
