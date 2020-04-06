import React, { Component } from 'react';
import axios from 'axios';
import ReactTable from "react-table";
import 'react-table/react-table.css';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      globalRankList: [],
      loading: true
    };
  }

  componentDidMount() {
    var self = this;
    var token = localStorage.getItem('token');
    var userID = localStorage.getItem('user_id');

    var apiPath = '/api/contests/globalRankList';
    axios.get(apiPath, {
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json'
      }
    })
      .then(function (response) {
        if (!response.data.success) {
          console.log("Error: " + response.data);
          return;
        }
        var data = response.data.globalRankList.userContenderDetails;
        data.sort(function (a, b) {
          return b.rating - a.rating;
        });
        self.setState({
          globalRankList: data,
          loading: false
        });

      })
      .catch(function (error) {
        self.setState({
          loading: false
        })
        console.log('Error: ', error);
      });
  }

  render() {

    const data = this.state.globalRankList;

    const columns =
      [
        {
          Header: "Rank",
          id: "row",
          maxWidth: 65,
          filterable: false,
          Cell: (row) => {
            return <div>{row.index + 1}</div>;
          }
        },
        {
          Header: "Name",
          accessor: "name"
        },
        {
          Header: "USN",
          accessor: "usn",
          maxWidth: 200,
        },
        {
          Header: "Contests",
          accessor: "timesPlayed",
          maxWidth: 100,
        },
        {
          Header: "Rating",
          accessor: "rating",
          maxWidth: 150,
        },
        {
          Header: "Best",
          accessor: "best",
          maxWidth: 150,
        }
      ]

    const staticText = {
      aboutUs: "We are a team that provides auto evaluation services. As of our beta release, maximum marks can be changed! Try it today. In our next release; set custom weights for different evaluation methods.",
      latestNews: "We use Natural Language Processing (NLP) techniques to auto evaluate student answers. This can be used for tests or assignments. The auto evaluation is performed on a sample answer and uses Jaccard Similarity and Cosine Distance.",
      announcements: "The test assignments are now available for view and submission. Marks will be displayed as auto evaluation is conducted. Head over to the respective pages to interact with our service."
    }

    return (
      <div>
          <div className="masthead-followup row m-0 bg-light mb-4" style={{ "borderRadius": 5 }}>
            <div className="col-12 col-md-4 p-3 p-md-8 border-right">
              <h3 className="text-center">About Us</h3>
              <p></p><p className="text-justify">{staticText.aboutUs}</p>
            </div>
            <div className="col-12 col-md-4 p-3 p-md-8 border-right">
            <h3 className="text-center">Methodology</h3>
              <p></p><p className="text-justify">{staticText.latestNews}</p>
            </div>
            <div className="col-12 col-md-4 p-3 p-md-">
            <h3 className="text-center">Announcements</h3>
              <p></p><p className="text-justify">{staticText.announcements}</p>
          </div>
        </div>
        {/* <div className="jumbotron pt-3 pb-2 bg-light">
          <div className='display-4 mb-3'>Global Rank List</div>
          <br />
          <ReactTable
            loading={this.state.loading}
            data={data}
            columns={columns}
            defaultSorted={[
              {
                id: "rating",
                desc: true
              }
            ]}
            defaultPageSize={10}
            index=""
            viewIndex=""
            className="-striped -highlight"
          />
          <br />
        </div> */}
      </div>
    );
  }
}

export default Home;
