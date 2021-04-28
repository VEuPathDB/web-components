import React from 'react';
import { hierarchy, Tree } from '@visx/hierarchy';
import { Group } from '@visx/group';
import { Text } from '@visx/text';
import {
  HierarchyPointLink,
  HierarchyPointNode,
} from '@visx/hierarchy/lib/types';
import { Line } from '@visx/shape';
import { LinearGradient } from '@visx/gradient';

interface CustomNode {
  node: HierarchyPointNode<StudyData>;
}

interface OffsetLine {
  link: HierarchyPointLink<StudyData>;
  nodeHeight: number;
  nodeWidth: number;
  orientation: Orientation;
}

export type VariableType =
  | 'category'
  | 'string'
  | 'number'
  | 'date'
  | 'longitude';

export interface Variables {
  id: string;
  providerLabel: string;
  displayName: string;
  type: VariableType;
  isContinuous?: boolean;
  precision?: number;
  units?: string;
  isMultiValued: boolean;
}

export interface StudyData {
  id: string;
  displayName: string;
  description: string;
  children?: this[];
  variables: Variables[];
}

export interface ShadingData {
  /** The key is the entity ID and the value is a decimal representing the
   * fraction of the node to shade */
  [index: string]: number;
}

export type Orientation = 'horizontal' | 'vertical';

export interface EntityDiagramProps {
  /** Data that defines the tree structure */
  treeData: StudyData;
  /** Which direction the tree is oriented */
  orientation: Orientation;
  /** Whether the diagram is expanded */
  isExpanded: boolean;
  /** Array of entity IDs that have filters applied */
  filteredEntities?: string[];
  /** The tree's dimensions. If the tree is horizontal, it may not take up the
   * whole height; if it's vertical, it may not take up the full width. */
  size: {
    height: number;
    width: number;
  };
  /** Which entity to highlight */
  highlightedEntityID: string;
  /** Data defining the background shading of each node */
  shadingData?: ShadingData;
  /** An optional function returning the element to render for a node given its
   * data */
  renderNode?: (
    node: StudyData,
    children?: Array<React.ReactElement>
  ) => React.ReactElement | null;
  selectedTextBold?: boolean;
  selectedBorderWeight?: number;
  selectedHighlightWeight?: number;
  selectedHighlightColor?: string;
  shadowDx?: number;
  shadowDy?: number;
  shadowDispersion?: number;
  shadowOpacity?: number;
  miniNodeWidth?: number;
  miniNodeHeight?: number;
  expandedNodeWidth?: number;
  expandedNodeHeight?: number;
  fontSize?: number;
  shadingColor?: string;
}

export default function EntityDiagram({
  treeData,
  orientation,
  isExpanded,
  highlightedEntityID,
  filteredEntities,
  shadingData,
  renderNode,
  size,
  selectedTextBold = true,
  selectedBorderWeight = 1,
  selectedHighlightWeight = 3,
  selectedHighlightColor = 'rgba(60, 120, 216, 1)',
  shadowDx = 2,
  shadowDy = 2,
  shadowDispersion = 0.2,
  shadowOpacity = 0.3,
  miniNodeWidth = 35,
  miniNodeHeight = 20,
  expandedNodeWidth = 120,
  expandedNodeHeight = 40,
  fontSize = 12,
  shadingColor = '#e4c8c8',
}: EntityDiagramProps) {
  const data = hierarchy(treeData);

  const radius = '.3em';

  const nodeWidth = isExpanded ? expandedNodeWidth : miniNodeWidth;
  const nodeHeight = isExpanded ? expandedNodeHeight : miniNodeHeight;
  // Node border width
  const nodeStrokeWidth = 2;
  // Width of the highlight border around the highlighted node
  const nodeHighlightWidth = selectedHighlightWeight;
  // treeHeight is always from root to furthest leaf, regardless of orientation
  // (it's not always vertical on screen)
  const treeHeight =
    (orientation === 'horizontal'
      ? size.width - nodeWidth
      : size.height - nodeHeight) -
    nodeHighlightWidth * 2 -
    shadowDy;
  // Likewise for treeWidth (it's not always horizontal on screen)
  const treeWidth = orientation === 'horizontal' ? size.height : size.width;
  // The tree's edge is in the middle of the boundary nodes, so we shift it by
  // half a node dimension
  const treeLeft =
    orientation === 'horizontal' ? nodeWidth / 2 + nodeHighlightWidth : 0;
  const treeTop =
    (orientation === 'horizontal' ? 0 : nodeHeight / 2) + nodeHighlightWidth; // Where the baby rocks

  function CustomNode({ node }: CustomNode) {
    let displayText: string;
    const isHighlighted = highlightedEntityID == node.data.displayName;

    if (isExpanded) {
      displayText = node.data.displayName;
    } else {
      // get acronym of displayName
      const matches = node.data.displayName.match(/\b(\w)/g) as string[];
      displayText = matches.join('');
    }

    // <rect>'s props don't account for stroke width, so we shrink them
    // accordingly to make sure the node is exactly the dimensions we want
    const rectHeight = nodeHeight - nodeStrokeWidth * 2;
    const rectWidth = nodeWidth - nodeStrokeWidth * 2;

    const borderWidth = isHighlighted ? selectedBorderWeight : nodeStrokeWidth;

    const shadingHeight = 8;

    const backgroundRect = (
      <rect
        height={rectHeight + borderWidth}
        width={rectWidth + borderWidth}
        y={-rectHeight / 2 - borderWidth / 2}
        x={-rectWidth / 2 - borderWidth / 2}
        rx={radius}
        fill="white"
        key={`bg-rect-${node.data.id}`}
        strokeWidth={borderWidth}
        stroke="transparent"
        style={{
          filter: shadowOpacity == 0 ? undefined : 'url(#shadow)',
        }}
      />
    );

    const borderRect = (
      <rect
        height={rectHeight + borderWidth}
        width={rectWidth + borderWidth}
        y={-rectHeight / 2 - borderWidth / 2}
        x={-rectWidth / 2 - borderWidth / 2}
        rx={radius}
        fill="none"
        stroke={isHighlighted ? selectedHighlightColor : '#666'}
        strokeWidth={borderWidth}
        key={`bd-rect-${node.data.id}`}
      />
    );

    const shadingRect = (
      <rect
        height={isExpanded ? shadingHeight : rectHeight}
        width={rectWidth}
        y={isExpanded ? rectHeight / 2 - shadingHeight : -rectHeight / 2}
        x={-rectWidth / 2}
        fill={
          shadingData?.[node.data.id]
            ? `url('#rect-gradient-${node.data.id}')`
            : 'white'
        }
        style={{
          overflowWrap: isExpanded ? 'normal' : undefined,
        }}
        key={`shading-rect-${node.data.id}`}
      />
    );

    const text = (
      <Text
        fontSize={fontSize}
        textAnchor="middle"
        verticalAnchor="middle"
        style={{
          userSelect: 'none',
          fontWeight: isHighlighted && selectedTextBold ? 'bold' : undefined,
        }}
        dy={-4}
        width={isExpanded ? nodeWidth - 40 : undefined}
        key={`text-${node.data.id}`}
      >
        {displayText}
      </Text>
    );

    const filterIcon = filteredEntities?.includes(node.data.id) ? (
      <Group>
        <title>This entity has filters</title>
        <Text
          key="filter-icon"
          fontSize={14}
          fontFamily="FontAwesome"
          fill="green"
          textAnchor="start"
          x={rectWidth / 2 - 16}
          dy={-shadingHeight / 2}
          verticalAnchor="middle"
        >
          &#xf0b0;
        </Text>
      </Group>
    ) : (
      <></>
    );

    let children = [backgroundRect, shadingRect, filterIcon, text, borderRect];

    return (
      <Group
        top={orientation == 'horizontal' ? node.x : node.y}
        left={orientation == 'horizontal' ? node.y : node.x}
        key={node.x + ':' + node.y}
      >
        {renderNode?.(node.data, children) ?? children}
        {!isExpanded && <title>{node.data.displayName}</title>}
      </Group>
    );
  }

  function OffsetLine({
    link,
    nodeHeight,
    nodeWidth,
    orientation,
  }: OffsetLine) {
    let to, from;

    // TODO Compute angle of line so it points into center of node or edge,
    // but begins in same place as now. Use pythagorean theorem to compute
    // x coordinates, and use `link.source.children` to determine y coordinates.

    if (orientation == 'horizontal') {
      to = {
        x: link.target.y - nodeWidth / 2 - 5 - 15,
        y: link.target.x,
      };
      from = { x: link.source.y + nodeWidth / 2 + 15, y: link.source.x };
    } else {
      to = {
        x: link.target.x,
        y: link.target.y - nodeHeight / 2 - 5,
      };
      from = { x: link.source.x, y: link.source.y };
    }

    return (
      <Line
        to={to}
        from={from}
        stroke="#777"
        strokeWidth={3}
        markerEnd="url(#arrow)"
      />
    );
  }

  return (
    <div className={isExpanded ? '' : 'mini-diagram'}>
      <svg width={size.width} height={size.height}>
        <defs>
          <marker
            id="arrow"
            viewBox="0 -5 10 10"
            markerWidth={isExpanded ? '6' : '3'}
            markerHeight={isExpanded ? '4' : '3'}
            orient="auto"
            fill="#777"
            refX={5}
          >
            <path d="M0,-5L10,0L0,5" />
          </marker>
          <filter id="shadow" x="-20%" y="-40%" width="150%" height="200%">
            <feDropShadow
              dx={shadowDx}
              dy={shadowDy}
              stdDeviation={shadowDispersion}
              floodOpacity={shadowOpacity}
            />
          </filter>
        </defs>
        {shadingData &&
          // Node background shading definitions
          Object.keys(shadingData).map((key, index) => (
            <LinearGradient
              key={index}
              vertical={false}
              x1={0}
              x2={shadingData[key]}
              fromOffset={1}
              id={`rect-gradient-${key}`}
              from={shadingColor}
              to={isExpanded ? '#cccccc' : 'white'}
            />
          ))}
        <Tree root={data} size={[treeWidth, treeHeight]}>
          {(tree) => (
            <Group left={treeLeft} top={treeTop}>
              {tree.links().map((link, i) => (
                <OffsetLine
                  link={link}
                  nodeHeight={nodeHeight}
                  nodeWidth={nodeWidth}
                  orientation={orientation}
                  key={`link-${i}`}
                />
              ))}
              {tree.descendants().map((node, i) => (
                <CustomNode node={node} key={`node-${i}`} />
              ))}
            </Group>
          )}
        </Tree>
      </svg>
    </div>
  );
}