import React from "react";
import {Table, Divider, Modal, Button} from "antd";
import axios from "axios";
import EditMovieInfo from "./EditMovieInfo";

class MovieDataAdmin extends React.Component {

    state = {
        movies: [],
        count: 0,
        currentRow: "",
        pagesize: 8,
        page: 1,
        visible: false,
    };

    componentDidMount = async (v) => {
        await this.getData();
    };

    getData = async v => {
        try {
            const response = await axios.get("api/movie/movies/?format=json" + "&page=" + this.state.page + "&page_size=" + this.state.pagesize);
            const temp = [];
            for (let index = 0; index < response.data.count; index++) {
                temp.push();
            }
            this.setState({
                movies: temp
            });
            for (let index = 0; index < response.data.results.length; index++) {
                temp[index] = response.data.results[index];
            }
            this.setState({
                movies: temp,
                count: response.data.count
            });
        } catch (error) {
            console.log(error);
        }
    };

    handleMovie = async page => {
        try {
            const response = await axios.get("api/movie/movies/?format=json" + "&page=" + page + "&page_size=" + this.state.pagesize);
            let temp = this.state.movies;
            let i = (page - 1) * this.state.pagesize;
            for (let index = 0; index < response.data.results.length; index++) {
                temp[i] = response.data.results[index];
                i++;
            }
            this.setState({
                movies: temp,
            });
        } catch (error) {
            console.log(error);
        }
    };


    handleEdit(row) {
        this.setState({currentRow: row, visible: true});
    }

    handleOk = () => {
        this.setState({visible: false});
    };

    handleCancel = () => {
        this.setState({visible: false});
    };

    getVisible = (v) => {
        this.setState({visible: v});
    };

    render() {
        const {movies} = this.state;
        const columns = [
            {
                title: 'Id',
                dataIndex: 'id',
                key: 'id',
                fixed: 'left',
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.id - b.id,
            },
            {
                title: 'Movie Name',
                dataIndex: 'name',
                key: 'name',
                fixed: 'left',
            },
            {
                title: 'Region',
                width: 100,
                dataIndex: 'region',
                key: 'region',
            }, {
                title: 'Length',
                width: 100,
                dataIndex: 'length',
                key: 'length',
            },
            // {
            //     title: 'Category',
            //     width: 100,
            //     dataIndex: 'category',
            //     key: 'category',
            //     fixed: 'left',
            // },
            {
                title: 'Language',
                width: 100,
                dataIndex: 'language',
                key: 'language',
            },
            {
                title: 'Release Date',
                width: 100,
                dataIndex: 'release_date',
                key: 'release_date',
            },
            {
                title: 'Director',
                width: 150,
                dataIndex: 'director',
                key: 'director',
                ellipsis: true,
            },
            {
                title: 'Scriptwriter',
                width: 150,
                dataIndex: 'scriptwriter',
                key: 'scriptwriter',
                ellipsis: true,
            },
            {
                title: 'actors',
                width: 150,
                dataIndex: 'actors',
                key: 'actors',
                ellipsis: true,
            }, {
                title: 'Rate',
                width: 100,
                dataIndex: 'rank',
                key: 'rank',
            }, {
                title: 'Poster',
                width: 100,
                dataIndex: 'poster',
                key: 'poster',
                ellipsis: true,
            }, {
                title: 'Video',
                width: 100,
                dataIndex: 'video',
                key: 'video',
                ellipsis: true,
            },
            {
                title: 'Action',
                key: 'operation',
                fixed: 'right',
                render: (text, row) => (
                    <div>
                        <Button type='link' onClick={() => this.handleEdit(row)}>
                            Edit
                        </Button>
                        <Divider type="vertical"/>
                        <Button type='link' onClick={() => this.handleDel(row)}>
                            Delete
                        </Button>
                    </div>
                )
            },
        ];

        return (
            <div>
                <Table
                    rowKey="id"
                    pagination={{
                        onChange: this.handleMovie,
                        total: this.state.count,
                        pageSize: this.state.pagesize,
                    }}
                    size="middle"
                    columns={columns}
                    dataSource={movies}
                    scroll={{x: 1400, y: 800}}/>
                <Modal width='600px' title="Edit info" visible={this.state.visible} onOk={this.handleOk}
                       onCancel={this.handleCancel}>
                    <EditMovieInfo data={this.state.currentRow} visible={this.state.visible} onOk={this.handleOk}
                                   onCancel={this.handleCancel}
                                   handleVisible={this.getVisible.bind(this)}
                                   wrappedComponentRef={form => (this.formRef = form)}/>
                </Modal>
            </div>

        )
    }

}

export default MovieDataAdmin