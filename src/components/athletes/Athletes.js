import React, { Component } from 'react';
import { Icon, Step } from 'semantic-ui-react';
import { Icon as Img } from 'antd';
import { Row, Col } from 'antd';
import SelectAthlete from './SelectAthlete';
import { Image, Grid } from 'semantic-ui-react';
import '../app/App.css';
import { List, Typography } from 'antd';
import AthleteDateHeatMap from './AthleteDateHeatMap';
import AthleteTransformer from '../../transformers/data/athleteTransformer';

const paragraph = (
  <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
);

const today = new Date();

export default class Athletes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Steps: {
        Athlete: {
          Active: true,
          Link: true,
          Disabled: false
        },
        Session: {
          Active: false,
          Link: false,
          Disabled: false
        },
        Analyze: {
          Active: false,
          Link: false,
          Disabled: false
        }
      },
      SelectedAthletes: []
    };
  }

  onSelectAthlete = async athletes => {
    this.setState({ SelectedAthletes: athletes });
    let Steps = this.state.Steps;
    Steps.Athlete.Active = false;
    Steps.Session.Active = true;
    this.setState({ Steps: Steps });
    var transformer = new AthleteTransformer();
    await transformer.getDays();
  };

  selectedAthlete = async () => {
    let Steps = this.state.Steps;
    Steps.Athlete.Active = true;
    Steps.Session.Active = false;
    this.setState({ Steps: Steps });
    this.setState({ SelectedAthletes: [] });
    console.log('AthleteTransformer');
  };

  render() {
    const { Steps, SelectedAthletes } = this.state;

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
          <Step active={Steps.Session.Active} link={Steps.Session.Link}>
            <Icon name="child" color="red" />
            <Step.Content>
              <Step.Title>Sessions</Step.Title>
              <Step.Description>
                Select the training session(s) to analyze
              </Step.Description>
            </Step.Content>
          </Step>

          <Step
            disabled
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
                    class="row"
                    width={800}
                    className="div-athlete"
                    style={{ backgroundColor: 'red' }}
                  >
                    <Row>
                      <Col span={16}>
                        <div
                          className="div-athlete-head"
                          style={{ color: 'white' }}
                        >
                          No athlete selected
                        </div>
                        <div
                          className="div-athlete-head"
                          style={{
                            fontSize: '1.9ex',
                            fontWeight: '200',
                            color: '#e7e0e0da'
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
            {SelectedAthletes.map(athlete => (
              <List size="small">
                <List.Item>
                  <div class="row" width={800} className="div-athlete">
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
              </List>
            ))}
          </div>
          <div class="column">
            {Steps.Athlete.Active && (
              <SelectAthlete
                onSelected={this.onSelectAthlete}
                athletes={SelectedAthletes}
              ></SelectAthlete>
            )}
          </div>
          {Steps.Session.Active && (
            <div class="column">
              <AthleteDateHeatMap />
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}
