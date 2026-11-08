import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

TARGET_COL = "avg_hatecrimes_per_100k_fbi"
INCOME_COL = "median_household_income"
STATE_COL = "state"

sns.set_theme(style="whitegrid", palette="viridis")


def _empty_fig(title: str):
    fig, ax = plt.subplots(figsize=(10, 5))
    ax.text(0.5, 0.5, "No data available for selected filters", ha="center", va="center", fontsize=14)
    ax.set_title(title, fontsize=15, fontweight="bold")
    ax.set_axis_off()
    fig.tight_layout()
    return fig


def pie_chart(df: pd.DataFrame):
    if df.empty or "income_group" not in df.columns:
        return _empty_fig("Pie Chart: Income Group Distribution")
    counts = df["income_group"].value_counts()
    fig, ax = plt.subplots(figsize=(8, 6))
    ax.pie(counts.values, labels=counts.index, autopct="%1.1f%%", startangle=90)
    ax.set_title("Pie Chart: Income Group Distribution", fontsize=15, fontweight="bold")
    fig.tight_layout()
    return fig


def histogram(df: pd.DataFrame):
    if df.empty:
        return _empty_fig("Histogram: Hate Crime Rate Distribution")
    fig, ax = plt.subplots(figsize=(10, 5))
    sns.histplot(df[TARGET_COL], bins=15, kde=True, ax=ax)
    ax.set_title("Histogram: Hate Crime Rate Distribution", fontsize=15, fontweight="bold")
    ax.set_xlabel("Average hate crimes per 100k")
    ax.set_ylabel("Frequency")
    fig.tight_layout()
    return fig


def line_chart(df: pd.DataFrame):
    if df.empty:
        return _empty_fig("Line Chart: Hate Crime Trend by Income Order")
    ordered = df.sort_values(INCOME_COL).reset_index(drop=True)
    ordered["sequence"] = np.arange(1, len(ordered) + 1)
    fig, ax = plt.subplots(figsize=(11, 5))
    sns.lineplot(data=ordered, x="sequence", y=TARGET_COL, marker="o", ax=ax)
    ax.set_title("Line Chart: Hate Crime Trend by Income Order", fontsize=15, fontweight="bold")
    ax.set_xlabel("States ordered by median household income")
    ax.set_ylabel("Average hate crimes per 100k")
    fig.tight_layout()
    return fig


def bar_chart(df: pd.DataFrame):
    if df.empty:
        return _empty_fig("Bar Chart: Top 10 States by Hate Crimes")
    top = df.sort_values(TARGET_COL, ascending=False).head(10)
    fig, ax = plt.subplots(figsize=(11, 6))
    sns.barplot(data=top, x=TARGET_COL, y=STATE_COL, ax=ax)
    ax.set_title("Bar Chart: Top 10 States by Hate Crimes", fontsize=15, fontweight="bold")
    ax.set_xlabel("Average hate crimes per 100k")
    ax.set_ylabel("State")
    fig.tight_layout()
    return fig


def scatter_plot(df: pd.DataFrame):
    if df.empty:
        return _empty_fig("Scatter Plot: Income vs Hate Crimes")
    fig, ax = plt.subplots(figsize=(10, 6))
    hue = "income_group" if "income_group" in df.columns else None
    sns.scatterplot(data=df, x=INCOME_COL, y=TARGET_COL, hue=hue, s=90, ax=ax)
    ax.set_title("Scatter Plot: Income vs Hate Crimes", fontsize=15, fontweight="bold")
    ax.set_xlabel("Median household income")
    ax.set_ylabel("Average hate crimes per 100k")
    fig.tight_layout()
    return fig


def box_plot(df: pd.DataFrame):
    if df.empty or "income_group" not in df.columns:
        return _empty_fig("Box Plot: Hate Crimes by Income Group")
    fig, ax = plt.subplots(figsize=(10, 5))
    sns.boxplot(data=df, x="income_group", y=TARGET_COL, ax=ax)
    ax.set_title("Box Plot: Hate Crimes by Income Group", fontsize=15, fontweight="bold")
    ax.set_xlabel("Income group")
    ax.set_ylabel("Average hate crimes per 100k")
    fig.tight_layout()
    return fig


def heatmap(df: pd.DataFrame):
    if df.empty:
        return _empty_fig("Heatmap: Correlation Matrix")
    numeric = df.select_dtypes(include=["number"])
    if numeric.shape[1] < 2:
        return _empty_fig("Heatmap: Correlation Matrix")
    fig, ax = plt.subplots(figsize=(15, 10))
    corr = numeric.corr()
    sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm", linewidths=0.5, ax=ax)
    ax.set_title("Heatmap: Correlation Matrix", fontsize=15, fontweight="bold")
    plt.xticks(rotation=45, ha="right")
    plt.yticks(rotation=0)
    fig.tight_layout()
    return fig


def area_chart(df: pd.DataFrame):
    if df.empty:
        return _empty_fig("Area Chart: Cumulative Hate Crime Rate")
    ordered = df.sort_values(INCOME_COL).reset_index(drop=True)
    ordered["sequence"] = np.arange(1, len(ordered) + 1)
    ordered["cumulative_hate_rate"] = ordered[TARGET_COL].cumsum()
    fig, ax = plt.subplots(figsize=(11, 5))
    ax.fill_between(ordered["sequence"], ordered["cumulative_hate_rate"], alpha=0.5)
    ax.plot(ordered["sequence"], ordered["cumulative_hate_rate"], linewidth=2)
    ax.set_title("Area Chart: Cumulative Hate Crime Rate", fontsize=15, fontweight="bold")
    ax.set_xlabel("States ordered by median household income")
    ax.set_ylabel("Cumulative hate crime rate")
    fig.tight_layout()
    return fig


def count_plot(df: pd.DataFrame):
    if df.empty or "income_group" not in df.columns:
        return _empty_fig("Count Plot: States by Income Group")
    fig, ax = plt.subplots(figsize=(9, 5))
    sns.countplot(data=df, x="income_group", ax=ax)
    ax.set_title("Count Plot: States by Income Group", fontsize=15, fontweight="bold")
    ax.set_xlabel("Income group")
    ax.set_ylabel("Number of states")
    fig.tight_layout()
    return fig


def violin_plot(df: pd.DataFrame):
    if df.empty or "income_group" not in df.columns:
        return _empty_fig("Violin Plot: Hate Crime Distribution by Income Group")
    fig, ax = plt.subplots(figsize=(10, 5))
    sns.violinplot(data=df, x="income_group", y=TARGET_COL, ax=ax, inner="quartile")
    ax.set_title("Violin Plot: Hate Crime Distribution by Income Group", fontsize=15, fontweight="bold")
    ax.set_xlabel("Income group")
    ax.set_ylabel("Average hate crimes per 100k")
    fig.tight_layout()
    return fig


def bubble_chart(df: pd.DataFrame):
    if df.empty:
        return _empty_fig("Bonus Bubble Chart: Poverty vs Hate Crimes")
    size_col = "share_non_white" if "share_non_white" in df.columns else TARGET_COL
    x_col = "share_white_poverty" if "share_white_poverty" in df.columns else INCOME_COL
    sizes = df[size_col].fillna(df[size_col].median())
    sizes = 80 + 700 * (sizes - sizes.min()) / (sizes.max() - sizes.min() + 1e-9)
    fig, ax = plt.subplots(figsize=(10, 6))
    scatter = ax.scatter(df[x_col], df[TARGET_COL], s=sizes, alpha=0.65)
    ax.set_title("Bonus Bubble Chart: Poverty vs Hate Crimes", fontsize=15, fontweight="bold")
    ax.set_xlabel(x_col.replace("_", " ").title())
    ax.set_ylabel("Average hate crimes per 100k")
    fig.tight_layout()
    return fig
