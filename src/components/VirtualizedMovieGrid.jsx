import { VariableSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useRef } from "react";
import MovieCard from "./MovieCard";

const VirtualizedMovieGrid = ({ movies, loading, hasMore, onLoadMore }) => {
  // cache to store calculated heights
  const gridRef = useRef();
  const rowHeights = useRef(new Map());

  const getGridDimensions = (width) => {
    let columnCount;
    let itemWidth;
    let horizontalSpacing;
    let verticalSpacing;

    if (width >= 1200) {
      // Desktop large
      columnCount = 5;
      horizontalSpacing = 24;
      verticalSpacing = 20;
      itemWidth = Math.floor(
        (width - horizontalSpacing * (columnCount + 1)) / columnCount
      );
    } else if (width >= 992) {
      // Desktop medium
      columnCount = 4;
      horizontalSpacing = 20;
      verticalSpacing = 18;
      itemWidth = Math.floor(
        (width - horizontalSpacing * (columnCount + 1)) / columnCount
      );
    } else if (width >= 768) {
      // Tablet
      columnCount = 3;
      horizontalSpacing = 16;
      verticalSpacing = 16;
      itemWidth = Math.floor(
        (width - horizontalSpacing * (columnCount + 1)) / columnCount
      );
    } else if (width >= 576) {
      // Mobile large
      columnCount = 2;
      horizontalSpacing = 12;
      verticalSpacing = 14;
      itemWidth = Math.floor(
        (width - horizontalSpacing * (columnCount + 1)) / columnCount
      );
    } else {
      // Mobile small
      columnCount = 1;
      horizontalSpacing = 8;
      verticalSpacing = 120;
      itemWidth = width - horizontalSpacing * 2;
    }

    return {
      columnCount,
      itemWidth,
      horizontalSpacing,
      verticalSpacing,
    };
  };

  const getRowHeight = (rowIndex, columnCount, verticalSpacing) => {
    //specific cache key that includes spacing
    const cacheKey = `${rowIndex}-${columnCount}-${verticalSpacing}`;
    if (rowHeights.current.has(cacheKey)) {
      return rowHeights.current.get(cacheKey);
    }

    let maxHeight = 300; // Base height for image

    // Check each movie in this row to find the tallest one
    for (let col = 0; col < columnCount; col++) {
      const movieIndex = rowIndex * columnCount + col;
      if (movieIndex >= movies.length) break;

      const movie = movies[movieIndex];

      // Estimate height based on title length and content
      let itemHeight = 320; // Base height for image
      itemHeight += 100; // Title area
      itemHeight += 40; // Content area with badges
      itemHeight += 40; // Base padding and margins

      // Add extra height for longer titles
      if (movie.title && movie.title.length > 30) {
        itemHeight += 20;
      }

      maxHeight = Math.max(maxHeight, itemHeight);
    }

    // Add the vertical spacing to the total height
    const totalHeight = maxHeight + verticalSpacing;

    // Cache the calculated height
    rowHeights.current.set(cacheKey, totalHeight);
    return totalHeight;
  };

  const getRowCount = (totalItems, columnCount) => {
    return Math.ceil(totalItems / columnCount);
  };

  const Cell = ({ columnIndex, rowIndex, style, data }) => {
    const {
      movies,
      columnCount,
      itemWidth,
      horizontalSpacing,
      verticalSpacing,
    } = data;
    const itemIndex = rowIndex * columnCount + columnIndex;

    if (itemIndex >= movies.length) {
      return <div style={style} />;
    }

    const movie = movies[itemIndex];

    return (
      <div style={style}>
        <div
          style={{
            width: itemWidth,

            marginLeft: horizontalSpacing / 2,
            marginRight: horizontalSpacing / 2,
            marginTop: verticalSpacing / 2,
            marginBottom: verticalSpacing / 2,

            maxHeight: style.height - verticalSpacing,
          }}
        >
          <MovieCard movie={movie} />
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: "70vh", width: "100%" }}>
      <AutoSizer>
        {({ height, width }) => {
          const { columnCount, itemWidth, horizontalSpacing, verticalSpacing } =
            getGridDimensions(width);
          const rowCount = getRowCount(movies.length, columnCount);

          return (
            <Grid
              ref={gridRef}
              columnCount={columnCount}
              columnWidth={() => itemWidth + horizontalSpacing}
              height={height}
              rowCount={rowCount}
              rowHeight={(index) =>
                getRowHeight(index, columnCount, verticalSpacing)
              }
              width={width}
              itemData={{
                movies,
                columnCount,
                itemWidth,
                horizontalSpacing,
                verticalSpacing,
              }}
              onItemsRendered={({
                visibleRowStartIndex,
                visibleRowStopIndex,
              }) => {
                const visibleItems = (visibleRowStopIndex + 1) * columnCount;
                const totalItems = movies.length;
                const threshold = 5;

                if (
                  !loading &&
                  hasMore &&
                  visibleItems > totalItems - threshold
                ) {
                  onLoadMore();
                }
              }}
            >
              {Cell}
            </Grid>
          );
        }}
      </AutoSizer>
    </div>
  );
};

export default VirtualizedMovieGrid;
