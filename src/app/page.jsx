import ImageSlider from '@/components/Home/ImageSlider';
import RightCard from '@/components/Home/RightCard';
import React from 'react'
import CategoryGrid from '@/components/Home/topCategories/CategoryGrid'
import CategorySection from '@/components/Home/categorySections/CategorySection';
import SubCategoryGrid from '@/components/Home/categorySections/SubCategoryGrid';
import  {categories}  from '@/components/constants/categories'
import SearchSection from "@/components/Home/SearchSection";
import Header from "@/components/layout/Header";
import SideButton from "@/components/layout/SideButton";
import Footer from "@/components/layout/Footer";

const Home = () => {

   const weddingItems = [
    {
      label: "Banquet Halls",
      slug: "banquet-halls",
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
    },
    {
      label: "Bridal Requisite",
      slug: "bridal-requisite",
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
    },
    {
      label: "Caterers",
      slug: "caterers",
      image:
        "https://images.unsplash.com/photo-1555244162-803834f70033",
    },
  ];

  const beautyItems = [
    {
      label: "Beauty Parlours",
      slug: "beauty-parlours",
      image:
        "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3",
    },
    {
      label: "Spa & Massages",
      slug: "spa-massage",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874",
    },
    {
      label: "Salons",
      slug: "salons",
      image:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035",
    },
  ];

  const repairItems = [
    {
      label: "AC Service",
      slug: "ac-service",
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
    },
    {
      label: "Car Service",
      slug: "car-service",
      image:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2",
    },
    {
      label: "Bike Service",
      slug: "bike-service",
      image:
        "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023",
    },
  ];

  const dailyNeeds = [
    {
      label: "Movies",
      slug: "movies",
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
    },
    {
      label: "Grocery",
      slug: "grocery",
      image:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2",
    },
    {
      label: "Electricians",
      slug: "electricians",
      image:
        "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023",
    },
  ];
  return (
     <div  className='bg-white'>

       <Header />
        <SideButton/>
        <SearchSection />
              <main className="bg-white px-7.5 text-gray-500">
             
      <div className="grid grid-cols-12 gap-6 mt-6 px-3">
          
          <div className="col-span-8">
            <ImageSlider />
          </div>

       
          <div className="col-span-4">
            <RightCard />
          </div>
        </div>

         <CategoryGrid categories={categories} />

          <div className="flex gap-8 flex-wrap justify-evenly items-center mt-6">
      <CategorySection title="Wedding Requisites">
        <SubCategoryGrid items={weddingItems} />
      </CategorySection>

      <CategorySection title="Beauty & Spa">
        <SubCategoryGrid items={beautyItems} />
      </CategorySection>

      <CategorySection title="Repairs & Services">
        <SubCategoryGrid items={repairItems} />
      </CategorySection>
      <CategorySection title="Daily Needs">
        <SubCategoryGrid items={dailyNeeds} />
      </CategorySection>
    </div>
     <br />
     <br />
     <br />

     </main> 
     <Footer/>
      </div>
  )
}
export default Home;