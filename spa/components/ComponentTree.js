import React from "react";


function getComponentTreeProps (path, index, parentLevel) {
  const newPath = [...path, [parentLevel + 1, index]];
  return {
    path: newPath,
    key: JSON.stringify(newPath)
  };
}

function ComponentTree({ path = [], tree, refs, assignedRefs = [] }) {
  const parentLevel = path.length ? path[path.length - 1][0] : -1;

  if (Array.isArray(tree)) {
      return tree.map((node, index) => (
        <ComponentTree
          {...getComponentTreeProps(path, index, parentLevel)}
          tree={node}
          refs={refs}
          assignedRefs={assignedRefs}
        />
      ));
  }

  let devmodeRef;

  for(let i = 0; i < refs.length; i++){
    if(!assignedRefs.includes(i)){
      devmodeRef = refs[i];
      assignedRefs.push(i);
      break;
    }
  }

  if(tree?.props?.children?.length){
    return (
      <tree.Component {...tree.props} devmodeRef={devmodeRef}>
        <ComponentTree
          path={path} tree={tree.props.children}
          refs={refs}
          assignedRefs={assignedRefs}
        />
      </tree.Component>
    );
  }

  if(tree?.props?.Component){
    return (
      <tree.Component {...tree.props} devmodeRef={devmodeRef} />
    );
  }

  return tree; // e.g. text
}


export default ComponentTree;


// function Box () {}

// <div>
//   <div>
//     <div>1</div>
//     <div>2</div>
//   </div>
// </div>

// const tree = [
//   {
//     Component: Box,
//     props: {
//       children: [
//         {
//           Component: Box,
//           props: {
//             children: [
//               {
//                 Component: Box,
//                 props: {
//                   children: ["1"],
//                   sx: {}
//                 }
//               },
//               {
//                 Component: Box,
//                 props: {
//                   children: ["2"],
//                   sx: {}
//                 }
//               }
//             ],
//             sx: {}
//           }
//         }
//       ],
//       sx: {

//       }
//     }
//   }
// ];
