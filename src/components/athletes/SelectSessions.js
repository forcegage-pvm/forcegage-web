import React from 'react';
import 'antd/dist/antd.css';
import '../../index.css';
import '../app/App.css';
import { Row, Col, Tag } from 'antd';
import { Button, Icon, Badge } from 'antd';
import { Icon as Sicon, Step } from 'semantic-ui-react';

const { CheckableTag } = Tag;

export default class SelectSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      FilteredData: props.FilteredData,
      Filters: props.Filters,
      Transformer: props.Transformer
    };
  }

  async componentDidMount() {
    const { FilteredData, Filters } = this.state;
    let weights = [];
    FilteredData.weights.map(weight => weights.push(weight.weight));
    let days = [];
    FilteredData.days.map(items => days.push(items.display));
    let exercises = [];
    FilteredData.exercises.map(items => exercises.push(items.exercise));
    let years = [];
    FilteredData.years.map(items => years.push(items.year));
    let sides = [];
    FilteredData.sides.map(side => sides.push(side.side));
    var filter = {
      years: years,
      days: days,
      exercises: exercises,
      weights: weights,
      sides: sides
    };
    if (Filters.set) {
      filter = Filters;
    }
    var filtered = await this.props.onFilterCount(filter);
    this.setState({
      FilteredData: filtered,
      Filters: filter
    });
  }

  handleExerciseSelectionChange = (tag, checked) => {
    this.doTagSelection(tag, checked, 'exercises');
  };

  onAnalyze = async e => {
    const { Filters, Transformer } = this.state;
    Filters.set = true;
    var statisticdata = await Transformer.filterData(Filters);
    this.props.onAnalyze(statisticdata, Filters);
  };

  handleSideSelectionChange = (tag, checked) => {
    this.doTagSelection(tag, checked, 'sides');
  };

  toggleWeights = e => {
    const { Filters, FilteredData } = this.state;
    var selection = [];
    if (Filters.weights.length !== FilteredData.weights.length) {
      FilteredData.weights.map(weight => selection.push(weight.weight));
    }
    this.setState(
      prevState => {
        let state = Object.assign({}, prevState);
        state.Filters.weights = selection;
        return { state };
      },
      () => {
        this.props.onFilter(Filters);
      }
    );
  };

  toggleDays = e => {
    const { Filters, FilteredData } = this.state;
    var selection = [];
    if (Filters.days.length !== FilteredData.days.length) {
      FilteredData.days.map(day => selection.push(day.display));
    }
    this.setState(
      prevState => {
        let state = Object.assign({}, prevState);
        state.Filters.days = selection;
        return { state };
      },
      () => {
        this.props.onFilter(Filters);
      }
    );
  };

  handleWeightSelectionChange = (tag, checked) => {
    this.doTagSelection(tag, checked, 'weights');
  };

  handleYearSelectionChange = (tag, checked) => {
    this.doTagSelection(tag, checked, 'years');
  };

  doTagSelection = (tag, checked, type) => {
    const { Filters } = this.state;
    const selection = checked
      ? [...Filters[type], tag]
      : Filters[type].filter(t => t !== tag);
    this.setState(
      prevState => {
        let state = Object.assign({}, prevState);
        state.Filters[type] = selection;
        return { state };
      },
      () => {
        this.props.onFilter(Filters);
      }
    );
  };

  handleDaySelectionChange = (tag, checked) => {
    this.doTagSelection(tag, checked, 'days');
  };

  render() {
    const { FilteredData, Filters } = this.state;

    return (
      <React.Fragment>
        <div style={{ marginLeft: '15px', width: '750px' }}>
          <Col>
            <Row>
              {
                <div style={{ marginLeft: '15px', marginTop: '5px' }}>
                  <h6 style={{ fontWeight: '500' }}>Exercises</h6>
                  {FilteredData.exercises.map(item => (
                    <Badge key={item.exercise} count={item.count}>
                      <CheckableTag
                        style={{
                          background:
                            Filters.exercises.indexOf(item.exercise) > -1
                              ? '#5DADE2'
                              : '#F4F6F6',
                          borderRadius: '5px',
                          height: '25px',
                          paddingLeft: '20px',
                          paddingRight: '20px',
                          marginLeft: '5px',
                          marginRight: '5px',
                          marginBottom: '10px'
                        }}
                        key={item.exercise}
                        checked={Filters.exercises.indexOf(item.exercise) > -1}
                        onChange={checked =>
                          this.handleExerciseSelectionChange(
                            item.exercise,
                            checked
                          )
                        }
                      >
                        {item.exercise}
                      </CheckableTag>
                    </Badge>
                  ))}
                </div>
              }
            </Row>
            <Row>
              {
                <div style={{ marginLeft: '15px', marginTop: '5px' }}>
                  <h6 style={{ fontWeight: '500' }}>Years</h6>
                  {FilteredData.years.map(item => (
                    <Badge count={item.count}>
                      <CheckableTag
                        style={{
                          background:
                            Filters.years.indexOf(item.year) > -1
                              ? '#E74C3C'
                              : '#F4F6F6',
                          borderRadius: '5px',
                          height: '25px',
                          paddingLeft: '20px',
                          paddingRight: '20px',
                          marginLeft: '5px',
                          marginRight: '5px',
                          marginBottom: '10px'
                        }}
                        key={item.year}
                        checked={Filters.years.indexOf(item.year) > -1}
                        onChange={checked =>
                          this.handleYearSelectionChange(item.year, checked)
                        }
                      >
                        {item.year}
                      </CheckableTag>
                    </Badge>
                  ))}
                </div>
              }
            </Row>
            <Row>
              {
                <div style={{ marginLeft: '15px', marginTop: '5px' }}>
                  <h6 style={{ fontWeight: '500' }}>Sides</h6>
                  {FilteredData.sides.map(item => (
                    <Badge count={item.count}>
                      <CheckableTag
                        style={{
                          background:
                            Filters.sides.indexOf(item.side) > -1
                              ? '#EB984E'
                              : '#F4F6F6',
                          borderRadius: '5px',
                          height: '25px',
                          paddingLeft: '20px',
                          paddingRight: '20px',
                          marginLeft: '5px',
                          marginRight: '5px',
                          marginBottom: '10px'
                        }}
                        key={item.side}
                        checked={Filters.sides.indexOf(item.side) > -1}
                        onChange={checked =>
                          this.handleSideSelectionChange(item.side, checked)
                        }
                      >
                        {item.side}
                      </CheckableTag>
                    </Badge>
                  ))}
                </div>
              }
            </Row>
            <Row>
              {
                <div style={{ marginLeft: '15px', marginTop: '5px' }}>
                  <h6 style={{ fontWeight: '500' }}>Days</h6>
                  <Row>
                    <Col span={1}>
                      <Button
                        type="secondary"
                        style={{
                          height: '25px',
                          width: '32px',
                          borderStyle: 'none',
                          marginRight: '-8px'
                        }}
                        onClick={() => {
                          this.toggleDays();
                        }}
                      >
                        <Sicon
                          name={
                            Filters.days.length !== FilteredData.days.length
                              ? 'clone'
                              : 'clone outline'
                          }
                          style={{
                            fontSize: '2.6ex',
                            marginLeft: '-10px',
                            marginTop: '-2px',
                            color: '#AEB6BF'
                          }}
                        ></Sicon>
                      </Button>
                    </Col>
                    <Col span={22}>
                      {FilteredData.days.map(item => (
                        <Badge count={item.count}>
                          <CheckableTag
                            style={{
                              background:
                                Filters.days.indexOf(item.display) > -1
                                  ? '#28B463'
                                  : '#F4F6F6',
                              borderRadius: '5px',
                              height: '25px',
                              paddingLeft: '20px',
                              paddingRight: '20px',
                              marginLeft: '5px',
                              marginRight: '5px',
                              marginBottom: '10px'
                            }}
                            key={item.display}
                            checked={Filters.days.indexOf(item.display) > -1}
                            onChange={checked =>
                              this.handleDaySelectionChange(
                                item.display,
                                checked
                              )
                            }
                          >
                            {item.display}
                          </CheckableTag>
                        </Badge>
                      ))}
                    </Col>
                  </Row>
                </div>
              }
            </Row>
            <Row>
              {
                <div style={{ marginLeft: '15px', marginTop: '5px' }}>
                  <h6 style={{ fontWeight: '500' }}>Weights</h6>
                  <Row>
                    <Col span={1}>
                      <Button
                        type="secondary"
                        style={{
                          height: '25px',
                          width: '32px',
                          borderStyle: 'none',
                          marginRight: '-8px'
                        }}
                        onClick={() => {
                          this.toggleWeights();
                        }}
                      >
                        <Sicon
                          name={
                            Filters.weights.length !==
                            FilteredData.weights.length
                              ? 'clone'
                              : 'clone outline'
                          }
                          style={{
                            fontSize: '2.6ex',
                            marginLeft: '-10px',
                            marginTop: '-2px',
                            color: '#AEB6BF'
                          }}
                        ></Sicon>
                      </Button>
                    </Col>
                    <Col span={22}>
                      {FilteredData.weights.map(item => (
                        <Badge count={item.count}>
                          <CheckableTag
                            style={{
                              background:
                                Filters.weights.indexOf(item.weight) > -1
                                  ? '#5B2C6F'
                                  : '#F4F6F6',
                              borderRadius: '5px',
                              height: '25px',
                              paddingLeft: '20px',
                              paddingRight: '20px',
                              marginLeft: '5px',
                              marginRight: '5px',
                              marginBottom: '10px'
                            }}
                            key={item.weight}
                            checked={Filters.weights.indexOf(item.weight) > -1}
                            onChange={checked =>
                              this.handleWeightSelectionChange(
                                item.weight,
                                checked
                              )
                            }
                          >
                            {item.weight}
                          </CheckableTag>
                        </Badge>
                      ))}
                    </Col>
                  </Row>
                </div>
              }
            </Row>
          </Col>
          <Row style={{ display: 'flex', marginTop: '15px' }}>
            <Button
              type="primary"
              style={{ marginLeft: '600px' }}
              onClick={() => {
                this.onAnalyze();
              }}
            >
              Analyze
              <Icon type="right" />
            </Button>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}
