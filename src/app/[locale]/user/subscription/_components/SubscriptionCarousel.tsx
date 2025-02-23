// "use client";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";
// import { SubscriptionPlan } from "@prisma/client";
// import React from "react";

// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// // type PlanName = "gratuit" | "bronze" | "argent" | "or" | "diamant";
// type PlanName = "gratuit" | "bronze" | "argent" | "or" | "diamant" | "visite3d";

// type Props = {
//   plans: SubscriptionPlan[];
//   COMPONENT_MAPPING: Record<PlanName, React.FC<any>>;
// };

// const SubscriptionCarousel: React.FC<Props> = ({
//   plans,
//   COMPONENT_MAPPING,
// }) => {
//   //   return (
//   //     <Swiper
//   //       modules={[Navigation, Pagination]}
//   //       spaceBetween={20}
//   //       slidesPerView={1}
//   //       navigation
//   //       pagination={{ clickable: true }}
//   //       breakpoints={{
//   //         640: { slidesPerView: 1 },
//   //         768: { slidesPerView: 2 },
//   //         1024: { slidesPerView: 3 },
//   //       }}
//   //       className="mt-6"
//   //     >
//   //       {plans.map((plan) => {
//   //         const PackComponent =
//   //           COMPONENT_MAPPING[plan.namePlan.toLowerCase() as PlanName];
//   //         return PackComponent ? (
//   //           <SwiperSlide key={plan.id}>
//   //             <div className="p-4">
//   //               <PackComponent data={plan} />
//   //             </div>
//   //           </SwiperSlide>
//   //         ) : null;
//   //       })}
//   //     </Swiper>
//   //   );
//   return (
//     <Swiper
//       modules={[Navigation, Pagination]}
//       spaceBetween={20}
//       slidesPerView={1}
//       navigation
//       autoHeight={false}
//       loop={false}
//       pagination={{ clickable: true }}
//       // Responsive breakpoints
//       breakpoints={{
//         // when window width is >= 640px
//         640: { slidesPerView: 1 },
//         // when window width is >= 768px
//         768: { slidesPerView: 2 },
//         // when window width is >= 1024px
//         1024: { slidesPerView: 3 },
//       }}
//       className="mt-6"
//       //   style={{ height: "750px" }}
//     >
//       {plans.map((plan) => {
//         const PackComponent =
//           COMPONENT_MAPPING[plan.namePlan.toLowerCase() as PlanName];
//         return PackComponent ? (
//           <SwiperSlide key={plan.id} className="h-auto">
//             <div className="p-4 h-full">
//               <div className="h-full flex">
//                 <PackComponent data={plan} />
//               </div>
//             </div>
//           </SwiperSlide>
//         ) : null;
//       })}
//     </Swiper>
//   );
// };

// export default SubscriptionCarousel;
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { SubscriptionPlan } from "@prisma/client";
import React from "react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type PlanName = "gratuit" | "bronze" | "argent" | "or" | "diamant" | "visite3d";

// Mise à jour des types pour gérer les plans partiels
type PartialPlan = Partial<SubscriptionPlan>;

type Props = {
  plans: (SubscriptionPlan | PartialPlan)[];
  COMPONENT_MAPPING: Record<PlanName, React.FC<any>>;
  isAuthenticated?: boolean;
};

const SubscriptionCarousel: React.FC<Props> = ({
  plans,
  COMPONENT_MAPPING,
  isAuthenticated = false,
}) => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={20}
      slidesPerView={1}
      navigation
      autoHeight={false}
      loop={false}
      pagination={{ clickable: true }}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      className="mt-6"
    >
      {plans.map((plan, index) => {
        const PackComponent =
          COMPONENT_MAPPING[plan.namePlan?.toLowerCase() as PlanName];

        return PackComponent ? (
          <SwiperSlide key={plan.id || index} className="h-auto">
            <div className="p-4 h-full">
              <div className="h-full flex">
                <PackComponent data={plan} isAuthenticated={isAuthenticated} />
              </div>
            </div>
          </SwiperSlide>
        ) : null;
      })}
    </Swiper>
  );
};

export default SubscriptionCarousel;
