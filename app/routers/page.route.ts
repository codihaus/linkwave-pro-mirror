export default [
    {
        name: "home",
        path: "/",
        file: "/project/listing.vue",
    },
    {
        name: "project-listing",
        path: "/projects/:id?",
        file: "/project/listing.vue",
    },
    {
        name: "project-detail",
        path: "/project/:id",
        file: "/project/detail.vue",
    },
    {
        name: "project-ai-assistant",
        path: "/project/:id/ai-assistant",
        file: "/project/ai-assistant.vue",
    },
    {
        name: "project-cost-estimator",
        path: "/project/:id/cost-estimator",
        file: "/project/cost-estimator/listing.vue",
    },
    {
        name: "project-cost-estimator-detail",
        path: "/project/:id/cost-estimator/:file_id",
        file: "/project/cost-estimator/detail.vue",
    },
]