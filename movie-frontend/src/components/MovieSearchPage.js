import React, { useState } from 'react';
import {Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress} from "shards-react";
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
    Table,
    Pagination,
    Select,
    Row,
    Col,
    Divider,
    Slider,
    Rate
} from 'antd'
import {RadarChart} from 'react-vis';
import {format} from 'd3-format';

import {getKeywordSearch, getSimilarTypeSearch, getTypeSearch, getIdSearch} from '../fetcher'
const wideFormat = format('.3r');

const ButtonToggle = styled(Button)`
  opacity: 0.6;
  ${({ active }) =>
    active &&
    `
    opacity: 1;
  `}
`;

const ButtonGroup = styled.div`
  display: flex;
`;



const movieColumns = [
    {
        title: 'Name',
        dataIndex: 'title',
        key: 'title',
        sorter: (a, b) => a.title.localeCompare(b.title),
        render: (text, row) => <a href={`/movieSearchPage?id=${row.movie_id}`}>{text}</a>
    },
    {
        title: 'Release date',
        dataIndex: 'release_date',
        key: 'release_date',
        sorter: (a, b) => a.release_date.localeCompare(b.release_date)
    },
    {
        title: 'Movie Length (min)',
        dataIndex: 'runtime',
        key: 'runtime',
        sorter: (a, b) => a.runtime - b.runtime
    },

    
    {
        title: 'Rating',
        dataIndex: 'vote_average',
        key: 'vote_average',
        sorter: (a, b) => a.vote_average - b.vote_average
    },

    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
    }

];


class MovieSearchPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            keywordQuery: '',
            typeQuery: '',
            similarTypeQuery: '',
            selectedMovieId: window.location.search ? window.location.search.substring(1).split('=')[1] : 97593,
            selectedMovieDetails: null,
            movieResults: [],
            similarMovieResults: []

        }

        this.updateKeywordSearchResults = this.updateKeywordSearchResults.bind(this)
        this.handleKeywordQueryChange = this.handleKeywordQueryChange.bind(this)
        this.handleTypeQueryChange = this.handleTypeQueryChange.bind(this)
        this.handleSimilarTypeQueryChange = this.handleSimilarTypeQueryChange.bind(this)
        this.getGoHandsMovies = this.getGoHandsMovies.bind(this)
        this.getActionMovies = this.getActionMovies.bind(this)
        this.getAniplexMovies = this.getAniplexMovies.bind(this)
        this.getComedyMovies = this.getComedyMovies.bind(this)
        this.getCrimeMovies = this.getCrimeMovies.bind(this)
        this.getScienceMovies = this.getScienceMovies.bind(this)
        this.getThrillerMovies = this.getThrillerMovies.bind(this)
        this.getWesternMovies = this.getWesternMovies.bind(this)
        this.getDocumentaryMovies = this.getDocumentaryMovies.bind(this)
        this.getGoHandsMovies = this.getGoHandsMovies.bind(this)

    }

    updateTypeSearchResults(type) {
        getKeywordSearch(type.name).then(res => {
            this.setState({movieResults: res['results']})
        })
    }


    handleKeywordQueryChange(event) {
        this.setState({keywordQuery: event.target.value})
    }

    handleTypeQueryChange(event) {
        this.setState({typeQuery: event.target.value})
    }

    updateKeywordSearchResults() {
        getKeywordSearch(this.state.keywordQuery).then(res => {
            this.setState({movieResults: res['results']})
        })
    }

    getActionMovies() {
        this.updateTypeSearchResults({'name': 'Action'})
    }

    getComedyMovies() {
        this.updateTypeSearchResults({'name': 'Comedy'})
    }

    getHistoryMovies() {
        this.updateTypeSearchResults({'name': 'History'})
    }

    getThrillerMovies() {
        this.updateTypeSearchResults({'name': 'Thriller'})
    }

    getCrimeMovies() {
        this.updateTypeSearchResults({'name': 'Crime'})
    }


    getWesternMovies() {
        this.updateTypeSearchResults({'name': 'Western'})
    }

    getDocumentaryMovies() {
        this.updateTypeSearchResults({'name': 'Documentary'})
    }

    getScienceMovies() {
        this.updateKeywordSearchResults({'name': 'Science Fiction'})
    }

    getAniplexMovies() {
        this.updateKeywordSearchResults({'name': 'Aniplex'})
    }

    getGoHandsMovies() {
        this.updateKeywordSearchResults({'name':'GoHands'})
    }




    handleSimilarTypeQueryChange() {
        getSimilarTypeSearch(this.state.keywordQuery).then(res => {
            this.setState({similarMovieResults: res['results']})
        })
    }

    componentDidMount() {
        getKeywordSearch(this.state.keywordQuery).then(res => {
            this.setState({ movieResults: res.results })
        })

        getIdSearch(this.state.selectedMovieId).then(res => {
            this.setState({selectedMovieDetails: res.results[0]})
        })
    }

    

    render() {
        return (
            <div>
                <Form style={{width: '80vw', margin: '0 auto', marginTop: '5vh'}}>
                    <Row>
                        <Col flex={1}><FormGroup style={{width: '55vw', margin: '0 auto'}}>
                            <label>Type keyword to search</label>
                            <FormInput placeholder="Keyword" value={this.state.keywordQuery}
                                       onChange={this.handleKeywordQueryChange}/>
                        </FormGroup></Col>
                        <Col flex={1}><FormGroup style={{width: '10vw'}}>
                            <Button style={{marginTop: '4vh'}} onClick={this.updateKeywordSearchResults}>Search</Button>
                        </FormGroup></Col>
                    </Row>
                    <br>
                    </br>
                    <Row>
                    <Col flex={2} style={{ textAlign: 'left' }}>
                            <label>Search By Movie Type</label>
                    </Col>
                    </Row>
                    <Row>
                    <ButtonGroup>
                    <Button  onClick={this.getActionMovies} theme="secondary" outline theme="success" style={{ marginLeft: "auto" }}> Action </Button>
                    <Button onClick={this.getComedyMovies} theme="secondary" outline theme="success"> Comedy </Button>
                    <Button onClick={this.getHistoryMovies} theme="secondary" outline theme="success"> History </Button>
                    <Button onClick={this.getThrillerMovies} theme="secondary" outline theme="success"> Thriller </Button>         
                    </ButtonGroup>
                    </Row>
                    <ButtonGroup>
                    <Button onClick={this.getCrimeMovies} theme="secondary" outline theme="success"> Crime </Button>
                    <Button onClick={this.getWesternMovies} theme="secondary" outline theme="success"> Western </Button>
                    <Button onClick={this.getDocumentaryMovies} theme="secondary" outline theme="success"> Documentary </Button>
                    <Button onClick={this.getScienceMovies} theme="secondary" outline theme="success"> Science Fiction </Button>
                    <Button onClick={this.getAniplexMovies} theme="secondary" outline theme="success"> Aniplex </Button>
                    <Button onClick={this.getGoHandsMovies} theme="secondary" outline theme="success"> GoHands </Button>
                    </ButtonGroup>
                    <br></br>
                </Form>
                

                <Divider/>
                <div style={{width: '70vw', margin: '0 auto', marginTop: '2vh'}}>
                    <h3>Movies</h3>
                    <Table dataSource={this.state.movieResults} columns={movieColumns}
                           pagination={{pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true}}/>
                </div>
                <Divider/>

                {this.state.selectedMovieDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <Card>
                    
                        <CardBody>

                        <Row gutter='30' align='middle' justify='center'>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                                <Row gutter='30' align='middle' justify='left'>
                                <Col flex={2} style={{textAlign: 'left'}}>
                                    <h3>{this.state.selectedMovieDetails.title}</h3>

                                </Col>
                                </Row>
                                <Row gutter='30' align='middle' justify='left'>
                                <Col>
                                Status: {this.state.selectedMovieDetails.status}
                                </Col>
                                </Row>

                                <Row gutter='30' align='middle' justify='left'>
                                <Col>
                                Length in minutes: {this.state.selectedMovieDetails.runtime}
                                </Col>
                                </Row>

                                <Row gutter='30' align='middle' justify='left'>
                                <Col>
                                Status: {this.state.selectedMovieDetails.status}
                                </Col>
                                </Row>

                                <Row>
                                <Col>
                                Release Date: {this.state.selectedMovieDetails.release_date}
                                </Col>
                                </Row>
                                <br>
                                </br>
                                <Row>
                                <Col flex={2} style={{textAlign: 'left'}}>
                                    <h6>Rating</h6>
                                    <Rate disabled defaultValue={this.state.selectedMovieDetails.vote_average / 2}/>
                                </Col>
                                </Row>
                            </Col>

                            <Col flex={2} style={{ textAlign: 'right' }}>
                            <img src={this.state.selectedMovieDetails.poster_link} style={{height:'40vh'}}/>
                            </Col>
                        </Row>
                        </CardBody>

                    </Card>

                </div> : null}


            </div>

        )

        
    }
}

export default MovieSearchPage