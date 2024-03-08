 constant: vis_id {
        value: "weekly_business_review_working_backwards_amazon"
        export: override_optional
    }
    constant: vis_label {
        value: "Weekly Business Review (Working Backwards - Amazon)"
        export: override_optional
    }
    visualization: {
        id: "@{vis_id}"
        label: "@{vis_label}"
        file: "dist/weeklyBusinessReview.js"
        sri_hash: "my_sri_hash"
        dependencies: []
    }