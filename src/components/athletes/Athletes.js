import React, { Component } from 'react';
import _ from 'lodash';
import { Icon, Step } from 'semantic-ui-react';
import { Icon as Img } from 'antd';
import { Row, Col, Spin } from 'antd';
import SelectAthlete from './SelectAthlete';
import '../app/App.css';
import { List } from 'antd';
import AthleteTransformer from '../../transformers/data/athleteTransformer';
import SelectSession from './SelectSessions';

import Analyze from './Analyze';

export default class Athletes extends Component {
  constructor(props) {
    super(props);
    this.transformer = new AthleteTransformer();
    this.state = {
      Steps: {
        Athlete: {
          Active: true,
          Link: true,
          Disabled: false,
          Loading: false
        },
        Session: {
          Active: false,
          Link: false,
          Disabled: false,
          Loading: false
        },
        Analyze: {
          Active: false,
          Link: false,
          Disabled: true,
          Loading: false
        }
      },
      SelectedAthletes: [],
      FilteredData: [],
      StatisticData: [],
      AllData: [],
      Filters: {
        years: [],
        days: [],
        exercises: [],
        weights: [],
        sides: [],
        set: false
      }
    };
  }

  onFilter = async filter => {
    const { FilteredData } = this.state;
    var filteredData = await this.transformer.count(FilteredData, filter);
    this.setState({ FilteredData: filteredData });
  };

  onFilterCount = async filter => {
    const { FilteredData } = this.state;
    return this.transformer.count(FilteredData, filter);
  };

  onAnalyze = async (statistics, filters) => {
    let Steps = this.state.Steps;
    this.setState(
      {
        StatisticData: statistics
      },
      () => {
        Steps.Athlete.Active = false;
        Steps.Session.Active = false;
        Steps.Session.Link = true;
        Steps.Analyze.Active = true;
        Steps.Analyze.Disabled = false;
        Steps.Session.Loading = false;
        filters.set = true;
        this.setState({
          Steps: Steps,
          Filters: filters
        });
      }
    );
  };

  onSelectAthlete = async athletes => {
    this.setState({ SelectedAthletes: athletes });
    let Steps = this.state.Steps;
    Steps.Athlete.Active = false;
    Steps.Session.Active = false;
    Steps.Analyze.Active = false;
    Steps.Session.Loading = true;
    Steps.Session.Link = false;
    this.setState(
      prevState => {
        let state = Object.assign({}, prevState);
        // state.FilteredData = filteredData;
        // state.AllData = filteredData;
        // state.Steps = Steps;
        state.Filters.set = false;
        return { state };
      },
      () => {}
    );
    this.setState({ Steps: Steps });
    let filteredData = await this.transformer.getTopLevelData(athletes[0].key);
    Steps.Session.Loading = false;
    Steps.Session.Active = true;
    this.setState({ FilteredData: filteredData });
    this.setState({ AllData: filteredData });
    this.setState({ Steps: Steps });
  };

  selectedAthlete = async () => {
    let Steps = this.state.Steps;
    Steps.Athlete.Active = true;
    Steps.Session.Active = false;
    Steps.Session.Link = false;
    Steps.Analyze.Active = false;
    Steps.Analyze.Disabled = true;
    this.setState({ Steps: Steps });
    this.setState({ SelectedAthletes: [] });
  };

  selectedFilter = async () => {
    let Steps = this.state.Steps;
    Steps.Session.Active = true;
    Steps.Session.Link = false;
    Steps.Athlete.Link = true;
    Steps.Analyze.Active = false;
    Steps.Analyze.Disabled = true;
    Steps.Session.Loading = false;
    this.setState({ Steps: Steps });
  };

  render() {
    const {
      Steps,
      SelectedAthletes,
      FilteredData,
      StatisticData,
      Filters
    } = this.state;

    return (
      <React.Fragment>
        <Step.Group>
          <Step
            active={Steps.Athlete.Active}
            link={Steps.Athlete.Link}
            onClick={this.selectedAthlete}
          >
            <Icon name="user plus" color="teal" />
            <Step.Content>
              <Step.Title>Athletes</Step.Title>
              <Step.Description>
                Select the Athlete(s) to analyze
              </Step.Description>
            </Step.Content>
          </Step>
          <Step
            active={Steps.Session.Active}
            link={false}
            onClick={!Steps.Athlete.Active && this.selectedFilter}
          >
            <Icon name="child" color="red" />
            <Step.Content>
              <Step.Title>Sessions</Step.Title>
              <Step.Description>
                Select the training session(s) to analyze
              </Step.Description>
            </Step.Content>
          </Step>

          <Step
            disabled={Steps.Analyze.Disabled}
            active={Steps.Analyze.Active}
            link={Steps.Analyze.Link}
          >
            <Icon name="chart area" />
            <Step.Content>
              <Step.Title>Analyze</Step.Title>
              <Step.Description>
                Analyze the session data for the athlete(s)
              </Step.Description>
            </Step.Content>
          </Step>
        </Step.Group>
        <div class="row">
          <div class="column">
            {SelectedAthletes.length === 0 && (
              <List size="small">
                <List.Item>
                  <div
                    width={800}
                    className="div-athlete"
                    style={{
                      backgroundColor: '#FDEDEC',
                      borderColor: '#D6DBDF'
                    }}
                  >
                    <Row>
                      <Col span={16}>
                        <div
                          className="div-athlete-head"
                          style={{ color: '#ABB2B9' }}
                        >
                          No athlete selected
                        </div>
                        <div
                          className="div-athlete-head"
                          style={{
                            fontSize: '1.9ex',
                            fontWeight: '200',
                            color: '#ABB2B9'
                          }}
                        >
                          select one to start
                        </div>
                      </Col>
                    </Row>
                  </div>
                </List.Item>
              </List>
            )}

            <List size="small">
              {SelectedAthletes.map(athlete => (
                <List.Item key={athlete.key}>
                  <div
                    class="row"
                    width={800}
                    className="div-athlete"
                    key={athlete.key}
                  >
                    <Row>
                      <Col span={16}>
                        <div className="div-athlete-head">{athlete.name}</div>
                        <div
                          className="div-athlete-head"
                          style={{ fontSize: '1.9ex', fontWeight: '200' }}
                        >
                          {'Bodyweight: ' + athlete.bodyweight}
                        </div>
                      </Col>
                      <Col span={8}>
                        <Img
                          type="user"
                          style={{
                            marginLeft: '20px',
                            fontSize: '5.1ex',
                            color: '#28326986'
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                </List.Item>
              ))}
            </List>
          </div>
          <div className="column">
            {Steps.Athlete.Active && (
              <SelectAthlete
                onSelected={this.onSelectAthlete}
                athletes={SelectedAthletes}
              ></SelectAthlete>
            )}
          </div>
          {Steps.Session.Loading && (
            <div className="column">
              <Spin
                size="large"
                tip="Loading sessions..."
                style={{ height: '800px', width: '800px', textAlign: 'center' }}
              ></Spin>
              ,
            </div>
          )}
          {Steps.Session.Active && (
            <SelectSession
              FilteredData={FilteredData}
              Filters={Filters}
              Transformer={this.transformer}
              onFilter={this.onFilter}
              onFilterCount={this.onFilterCount}
              onAnalyze={this.onAnalyze}
            ></SelectSession>
          )}
          {Steps.Analyze.Active && (
            <Analyze statistics={StatisticData}></Analyze>
          )}
        </div>
      </React.Fragment>
    );
  }
}
