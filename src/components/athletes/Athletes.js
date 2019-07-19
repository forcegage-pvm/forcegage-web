import React, { Component } from 'react'
import { Icon, Step } from 'semantic-ui-react'
import { Row, Col } from 'antd';
import SelectAthlete from './SelectAthlete'
import { Image, Item } from 'semantic-ui-react'
import avatar1 from '../../assets/avatar1.png'
import avatar2 from '../../assets/avatar2.png'

const paragraph = <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />

export default class Athletes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Steps:
            {
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
                },
            },
            SelectedAthletes: []
        }
    }

    onSelectAthlete = (athletes) => {
        this.setState({ SelectedAthletes: athletes });
        let Steps = this.state.Steps
        Steps.Athlete.Active = false
        Steps.Session.Active = true
        this.setState({ Steps: Steps });
    }

    selectedAthlete = () => {
        let Steps = this.state.Steps
        Steps.Athlete.Active = true
        Steps.Session.Active = false
        this.setState({ Steps: Steps });
    }

    render() {
        const { Steps, SelectedAthletes } = this.state

        return (
            <React.Fragment>
                <Step.Group>
                    <Step active={Steps.Athlete.Active} link={Steps.Athlete.Link}
                        onClick={this.selectedAthlete}>
                        <Icon name='user plus' color="teal" />
                        <Step.Content>
                            <Step.Title>Athletes</Step.Title>
                            <Step.Description>Select the Athlete(s) to analyze</Step.Description>
                        </Step.Content>
                    </Step>
                    <Step active={Steps.Session.Active} link={Steps.Session.Link}>
                        <Icon name='child' color="red" />
                        <Step.Content>
                            <Step.Title>Sessions</Step.Title>
                            <Step.Description>Select the training session(s) to analyze</Step.Description>
                        </Step.Content>
                    </Step>

                    <Step disabled active={Steps.Analyze.Active} link={Steps.Analyze.Link}>
                        <Icon name='chart area' />
                        <Step.Content>
                            <Step.Title>Analyze</Step.Title>
                            <Step.Description>Analyze the session data for the athlete(s)</Step.Description>
                        </Step.Content>
                    </Step>

                </Step.Group>
                <Row>
                    <Col span={4}>
                        <Item.Group relaxed='very'>
                            {SelectedAthletes.map((athlete) =>
                                <Item>
                                    <Item.Image size='tiny' src={avatar2} />
                                    <Item.Content verticalAlign='middle'>
                                        <Item.Header>{athlete.name}</Item.Header>
                                        <Item.Description>{'Bodyweight: '+athlete.bodyweight+' Kg'}</Item.Description>
                                        {/* <Item.Extra>{'Age: '+athlete.age}</Item.Extra> */}
                                    </Item.Content>
                                </Item>
                            )}

                        </Item.Group>
                    </Col>
                    {Steps.Athlete.Active && <Col span={5}>
                        <SelectAthlete onSelected={this.onSelectAthlete}></SelectAthlete>
                    </Col>}
                </Row>

            </React.Fragment>

        )
    }
}

