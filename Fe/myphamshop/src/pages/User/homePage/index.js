import { memo } from "react";
import Carousel from "react-multi-carousel";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-multi-carousel/lib/styles.css";
import "./style.scss";
import call1ing from "assets/User/images/slider/slider_1.jpg";
import call2ing from "assets/User/images/slider/slider_2.jpg";
import call3ing from "assets/User/images/slider/slider_3.jpg";
import call4ing from "assets/User/images/slider/slider_4.jpg";


import banner1Img from "assets/User/images/product/son_5.jpg";
import banner2Img from "assets/User/images/product/son_4.jpg";


import { ProductCard } from "component";
import { featproducts } from "utils/common";


const HomePage = () => {
    // Tạo 1 slide
    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 5
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
      };
    // Tạo 1 list slider
    const sliderItems = [
        {
            bgImg:call1ing,
            name:"Serum"
        },
        {
            bgImg:call2ing,
            name:"Son"
        },
        {
            bgImg:call3ing,
            name:"Dưỡng ẩm"
        },
        {
            bgImg:call4ing,
            name:"Toner"
        }
    ]
    

    const renderfeaturedProduct = (data) => {
        const tabList = [];
        const tabPanels = [];
        
        Object.keys(data).forEach((key, index) => {
            tabList.push(<Tab key={index}>{data[key].title}</Tab>);

            const tabPanel = [];
            data[key].products.forEach((item, j) => {
                tabPanel.push(
                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12" key = {j}>
                        <ProductCard name={item.name} img ={item.img} price = {item.price}/>
                    </div>
                )
            });
            tabPanels.push(tabPanel);
        });
          
        

        return (
            <Tabs>
                <TabList>{tabList}</TabList>
                {
                    tabPanels.map((item, key) => (
                        <TabPanel key = {key}>
                            <div className="row">{item}</div>
                        </TabPanel>
                    ))
                }
                
            </Tabs>
        );
    }

    return (
        <>
            { /* Slide*/},
            <div className="container container_categories_slider">
                <Carousel responsive={responsive} className="categories_slider">
                    {
                        sliderItems.map((item, key) => (
                            <div className="categories_slider_item"
                                style={{
                                    backgroundImage: `url(${item.bgImg})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                                >
                                <p>{item.name}</p>
                            </div>
                        ))
                    }
                </Carousel>
            </div>
            {/*Sản phẩm nổi bật*/}
            <div className="container">
                <div className="featured">
                    <div className="section-title">
                        <h2>Sản phẩm nổi bật</h2>
                    </div>
                    {renderfeaturedProduct(featproducts)}
                </div>
            </div>

            {/*Banner End*/}
            <div className="container">
                <div className="banner">
                    <div className="banner_img col-lg-6">
                        <img src= {banner1Img} alt="banner" />
                    </div>
                    <div className="banner_img col-lg-6">
                        <img src= {banner2Img} alt="banner" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default memo(HomePage);
