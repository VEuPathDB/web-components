interface NoDataOverlayProps {
  plotTitle?: string;
}

export default ({ plotTitle }: NoDataOverlayProps) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      background:
        plotTitle === 'No data'
          ? 'repeating-linear-gradient(45deg, #f8f8f8f8, #f8f8f8f8 10px, #fafafaf8 10px, #fafafaf8 20px)'
          : '#f8f8f8f8',
      fontSize: 24,
      color: ' #e8e8e8',
      userSelect: 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 450,
    }}
  >
    {plotTitle === 'No data' ? 'No missing data' : 'No data'}
  </div>
);
