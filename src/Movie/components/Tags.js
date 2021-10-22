import React from 'react';
import {Collapse, Icon, List, Tag, Typography} from "antd";

const Panel = Collapse.Panel;
const {Title} = Typography;
const {CheckableTag} = Tag;

const customPanelStyle = {
    background: "#fff",
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: "hidden"
};

const Tags = (props) => {

    const countryFromServer = ['USA', 'China', 'Mexico', 'Canada', 'UK', 'France',
        'South Korea', 'Japan', 'Belgium', 'Denmark', 'Ireland', 'Australia', 'United Arab Emirates',
        'India', 'Spain', 'Czech Republic', 'Sweden', 'Germany', 'Brazil', 'Italy', 'South Africa', 'Bahamas',
        'Hong Kong', 'Taiwan', ' Norway', 'Malta', 'Morocco', 'Netherlands', 'West Germany', 'Hungary', 'Jordan',
        'Poland','Lebanon'];

    return (
        <div>
            <Collapse
                bordered={false}
                defaultActiveKey={["1"]}
                expandIcon={({isActive}) => (
                    <Icon type="caret-right" rotate={isActive ? 90 : 0}/>
                )}
            >
                <Panel
                    header={<Title level={4}>Tags</Title>}
                    key="1"
                    style={customPanelStyle}
                >
                    <List
                        size="small"
                        dataSource={props.data}
                        renderItem={item => (
                            <List.Item>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    flexWrap: "wrap",
                                    alignItems: "center"
                                }}>
                                      <span
                                          style={{
                                              backgroundColor: "#5F5E5E",
                                              borderRadius: "10px 0 10px 10px",
                                              padding: "5px 15px",
                                              color: "white",
                                              margin: "0 24px 0 0"
                                          }}
                                      >
                                        {item.name}
                                      </span>
                                    {item.category.map(tag => (
                                        <CheckableTag
                                            style={{
                                                margin: "5px 5px",
                                                borderRadius: "5px"
                                            }}
                                            key={"tag_id" + tag.name}
                                            checked={props.selectedTags.indexOf(tag.id) > -1}
                                            onChange={checked => props.handleChange(tag.id, checked)}
                                        >
                                            {tag.name}
                                        </CheckableTag>
                                    ))}
                                </div>
                            </List.Item>
                        )}
                    />
                    <List size="small">
                        <List.Item>
                            <div style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                flexWrap: "wrap",
                                alignItems: "center"
                            }}>
                                <span style={{
                                    backgroundColor: "#5F5E5E",
                                    borderRadius: "10px 0 10px 10px",
                                    padding: "5px 15px",
                                    color: "white",
                                    margin: "0 24px 0 0"
                                }}>
                                    Country
                                </span>
                                {countryFromServer.map(country => (
                                    <CheckableTag
                                        style={{
                                            margin: "5px 5px",
                                            borderRadius: "5px"
                                        }}
                                        key={"tag_Country" + country}
                                        checked={props.selectedCountry.indexOf(country) > -1}
                                        onChange={checked => props.handleCountryChange(country, checked)}
                                    >
                                        {country}
                                    </CheckableTag>
                                ))}
                            </div>
                        </List.Item>
                    </List>
                </Panel>
            </Collapse>
        </div>
    )

};

export default Tags