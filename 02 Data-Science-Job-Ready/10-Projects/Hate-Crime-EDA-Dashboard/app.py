import os

import gradio as gr
import pandas as pd

from charts import (
    area_chart,
    bar_chart,
    box_plot,
    bubble_chart,
    count_plot,
    heatmap,
    histogram,
    line_chart,
    pie_chart,
    scatter_plot,
    violin_plot,
)
from filters import (
    DATA_FILE,
    INCOME_COL,
    TARGET_COL,
    STATE_COL,
    apply_filters,
    get_summary,
    load_and_clean_data,
    save_filtered_csv,
)

raw_df, df, cleaning_report = load_and_clean_data(DATA_FILE)

ALL_STATES = sorted(df[STATE_COL].unique().tolist())
ALL_INCOME_GROUPS = sorted(df["income_group"].unique().tolist())
MIN_INCOME = float(df[INCOME_COL].min())
MAX_INCOME = float(df[INCOME_COL].max())
MIN_HATE = float(df[TARGET_COL].min())
MAX_HATE = float(df[TARGET_COL].max())


def build_dashboard(
    selected_states,
    income_groups,
    min_income,
    max_income,
    min_hate,
    max_hate,
    search_text,
    sort_column,
    sort_order,
):
    filtered = apply_filters(
        df=df,
        selected_states=selected_states,
        income_groups=income_groups,
        min_income=min_income,
        max_income=max_income,
        min_hate=min_hate,
        max_hate=max_hate,
        search_text=search_text,
    )

    ascending = sort_order == "Ascending"
    if sort_column in filtered.columns and not filtered.empty:
        filtered = filtered.sort_values(sort_column, ascending=ascending)

    summary = get_summary(filtered)
    download_path = save_filtered_csv(filtered)

    insights = generate_insights(filtered)

    return (
        summary["total_records"],
        summary["total_states"],
        summary["avg_hate"],
        summary["max_hate"],
        summary["min_hate"],
        summary["avg_income"],
        pie_chart(filtered),
        histogram(filtered),
        line_chart(filtered),
        bar_chart(filtered),
        scatter_plot(filtered),
        box_plot(filtered),
        heatmap(filtered),
        area_chart(filtered),
        count_plot(filtered),
        violin_plot(filtered),
        bubble_chart(filtered),
        filtered,
        insights,
        download_path,
    )


def generate_insights(filtered: pd.DataFrame) -> str:
    if filtered.empty:
        return "No records match the selected filters. Reset filters or select more states."

    highest = filtered.loc[filtered[TARGET_COL].idxmax()]
    lowest = filtered.loc[filtered[TARGET_COL].idxmin()]

    corr_income = filtered[[INCOME_COL, TARGET_COL]].corr().iloc[0, 1]
    corr_text = "not enough data"
    if pd.notna(corr_income):
        corr_text = f"{corr_income:.2f}"

    return f"""
KEY DASHBOARD INSIGHTS

1. Total records after filters: {len(filtered)}
2. Highest hate crime rate: {highest[STATE_COL]} ({highest[TARGET_COL]:.3f})
3. Lowest hate crime rate: {lowest[STATE_COL]} ({lowest[TARGET_COL]:.3f})
4. Average median household income: {filtered[INCOME_COL].mean():.2f}
5. Correlation between income and hate crime rate: {corr_text}
6. All charts are connected to the filters and update together.
""".strip()


def reset_filters():
    return (
        ALL_STATES,
        ALL_INCOME_GROUPS,
        MIN_INCOME,
        MAX_INCOME,
        MIN_HATE,
        MAX_HATE,
        "",
        TARGET_COL,
        "Descending",
    )


with gr.Blocks(title="Hate Crime EDA Dashboard") as demo:
    gr.Markdown(
        """
        # 📊 Hate Crime Exploratory Data Analysis Dashboard
        This professional Gradio dashboard loads the exact raw dataset file, cleans it with Pandas, and creates all required visualizations with Matplotlib and Seaborn.
        """
    )

    with gr.Tab("Dashboard"):
        gr.Markdown("## Filters")
        with gr.Row():
            selected_states = gr.CheckboxGroup(
                choices=ALL_STATES,
                value=ALL_STATES,
                label="Multi-Select Filter: States",
            )
            income_groups = gr.CheckboxGroup(
                choices=ALL_INCOME_GROUPS,
                value=ALL_INCOME_GROUPS,
                label="Category Filter: Income Group",
            )

        with gr.Row():
            min_income = gr.Slider(MIN_INCOME, MAX_INCOME, value=MIN_INCOME, label="Minimum Income")
            max_income = gr.Slider(MIN_INCOME, MAX_INCOME, value=MAX_INCOME, label="Maximum Income")

        with gr.Row():
            min_hate = gr.Slider(MIN_HATE, MAX_HATE, value=MIN_HATE, label="Minimum Hate Crime Rate")
            max_hate = gr.Slider(MIN_HATE, MAX_HATE, value=MAX_HATE, label="Maximum Hate Crime Rate")

        with gr.Row():
            search_text = gr.Textbox(label="Search / Text Filter", placeholder="Search any keyword, e.g., Alabama")
            sort_column = gr.Dropdown(choices=list(df.columns), value=TARGET_COL, label="Sort Table By")
            sort_order = gr.Radio(choices=["Ascending", "Descending"], value="Descending", label="Sort Order")

        with gr.Row():
            update_btn = gr.Button("Update Dashboard", variant="primary")
            reset_btn = gr.Button("Reset / Clear Filters")

        gr.Markdown("## KPI Summary Cards")
        with gr.Row():
            total_records = gr.Number(label="Total Records")
            total_states = gr.Number(label="Total States")
            avg_hate = gr.Number(label="Average Hate Crime Rate")
        with gr.Row():
            max_hate_card = gr.Number(label="Highest Hate Crime Rate")
            min_hate_card = gr.Number(label="Lowest Hate Crime Rate")
            avg_income = gr.Number(label="Average Income")

        gr.Markdown("## Required Chart Types")
        with gr.Tab("1 Pie Chart"):
            pie_out = gr.Plot(label="Pie Chart")
        with gr.Tab("2 Histogram"):
            hist_out = gr.Plot(label="Histogram")
        with gr.Tab("3 Line Chart"):
            line_out = gr.Plot(label="Line Chart")
        with gr.Tab("4 Bar Chart"):
            bar_out = gr.Plot(label="Bar Chart")
        with gr.Tab("5 Scatter Plot"):
            scatter_out = gr.Plot(label="Scatter Plot")
        with gr.Tab("6 Box Plot"):
            box_out = gr.Plot(label="Box Plot")
        with gr.Tab("7 Heatmap"):
            heatmap_out = gr.Plot(label="Heatmap")
        with gr.Tab("8 Area Chart"):
            area_out = gr.Plot(label="Area Chart")
        with gr.Tab("9 Count Plot"):
            count_out = gr.Plot(label="Count Plot")
        with gr.Tab("10 Violin Plot"):
            violin_out = gr.Plot(label="Violin Plot")
        with gr.Tab("Bonus Bubble Chart"):
            bubble_out = gr.Plot(label="Bubble Chart")

        gr.Markdown("## Filtered Data and Insights")
        filtered_table = gr.Dataframe(label="Cleaned, Filtered Dataset", interactive=False)
        insight_box = gr.Textbox(label="Automatic Insights", lines=8)
        download_file = gr.File(label="Download Filtered CSV")

    with gr.Tab("Cleaning Report"):
        gr.Textbox(value=cleaning_report, label="Pandas Cleaning Report", lines=18)

    with gr.Tab("Raw Data"):
        gr.Dataframe(value=raw_df, label="Original Raw Dataset", interactive=False)

    with gr.Tab("Cleaned Data"):
        gr.Dataframe(value=df, label="Cleaned Dataset", interactive=False)

    with gr.Tab("Project Documentation"):
        gr.Markdown(
            """
            ## Project Requirement Coverage
            - Uses the exact dataset filename: `data/hate_crime.csv`
            - Loads, cleans, and analyzes data using Pandas
            - Uses NumPy for numerical operations
            - Uses Matplotlib and Seaborn for visualizations
            - Uses Gradio as the interactive frontend
            - Includes all 10 required chart types
            - Includes linked filters that update all charts together
            - Includes KPI summary cards
            - Includes raw data, cleaned data, cleaning report, insights, and CSV download

            ## Date / Time Filter Note
            The provided hate crime dataset does not contain a date or time column, so a date range filter is not applicable. A sequence-based line and area chart is used instead.
            """
        )

    inputs = [
        selected_states,
        income_groups,
        min_income,
        max_income,
        min_hate,
        max_hate,
        search_text,
        sort_column,
        sort_order,
    ]

    outputs = [
        total_records,
        total_states,
        avg_hate,
        max_hate_card,
        min_hate_card,
        avg_income,
        pie_out,
        hist_out,
        line_out,
        bar_out,
        scatter_out,
        box_out,
        heatmap_out,
        area_out,
        count_out,
        violin_out,
        bubble_out,
        filtered_table,
        insight_box,
        download_file,
    ]

    update_btn.click(build_dashboard, inputs=inputs, outputs=outputs)
    demo.load(build_dashboard, inputs=inputs, outputs=outputs)

    reset_btn.click(reset_filters, outputs=inputs).then(build_dashboard, inputs=inputs, outputs=outputs)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7861))
    demo.launch(theme=gr.themes.Soft(), server_name="0.0.0.0", server_port=port)
