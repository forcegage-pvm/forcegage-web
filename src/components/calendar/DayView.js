import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import { Button, Icon } from 'antd';
import 'react-alice-carousel/lib/alice-carousel.css';
import styles from './style.css';

export default class DayView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      responsive: this.responsive,
      galleryItems: this.galleryItems()
    };
  }
  items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  responsive = {
    0: { items: 1 },
    250: { items: 2 },
    500: { items: 3 },
    750: { items: 4 },
    1000: { items: 5 },
    1250: { items: 6 }
  };

  slideTo = i => this.setState({ currentIndex: i });

  onSlideChanged = e => this.setState({ currentIndex: e.item });

  slideNext = () =>
    this.setState({ currentIndex: this.state.currentIndex + 1 });

  slidePrev = () =>
    this.setState({ currentIndex: this.state.currentIndex - 1 });

  thumbItem = (item, i) => <span onClick={() => this.slideTo(i)}>* </span>;

  galleryItems() {
    return this.items.map(i => {
      return <div className="main-day-item">{i}</div>;
    });
  }

  render() {
    const { galleryItems, responsive, currentIndex } = this.state;
    return (
      <div className="main-day">
        <div className="main-day-content">
          <AliceCarousel
            dotsDisabled={true}
            buttonsDisabled={true}
            items={galleryItems}
            responsive={responsive}
            slideToIndex={currentIndex}
            onSlideChanged={this.onSlideChanged}
          />
        </div>
        {/* <ul>{this.items.map(this.thumbItem)}</ul> */}
        <div className="main-day-left">
          <Button
            type="primary"
            shape="circle"
            icon="search"
            onClick={() => this.slidePrev()}
          />
        </div>
        <div className="main-day-right">
          <Button
            type="primary"
            shape="circle"
            icon="search"
            onClick={() => this.slideNext()}
          />
        </div>
      </div>
    );
  }
}
