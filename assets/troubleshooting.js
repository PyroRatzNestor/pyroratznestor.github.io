(()=>{
  const own=(object,key)=>Object.prototype.hasOwnProperty.call(object,key);
  const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
  function validate(library,toolKeys){
    const fail=(location,message)=>{throw new Error(location+': '+message)};
    const text=(value,location)=>{
      if(typeof value!=='string'||!value.trim())fail(location,'nonempty text required');
    };
    const strings=(value,location)=>{
      if(!Array.isArray(value)||!value.length)fail(location,'nonempty list required');
      value.forEach((item,index)=>text(item,location+'['+index+']'));
    };
    if(!object(library)||library.schemaVersion!==1)fail('Troubleshooting library','unsupported or missing schemaVersion');
    text(library.safety,'safety');
    if(!object(library.techniques)||!Object.keys(library.techniques).length)fail('techniques','nonempty object required');
    const techniques=library.techniques;
    for(const [id,technique]of Object.entries(techniques)){
      const at='techniques.'+id;
      if(!/^[a-z][a-z0-9_]*$/.test(id)||['constructor','prototype'].includes(id))fail(at,'invalid stable identifier');
      if(!object(technique))fail(at,'object required');
      for(const field of ['title','symptom','start'])text(technique[field],at+'.'+field);
      for(const field of ['appliesTo','safetyPrerequisites','verification'])strings(technique[field],at+'.'+field);
      if(!Number.isInteger(technique.revision)||technique.revision<1)fail(at+'.revision','positive integer required');
      if(typeof technique.equipmentOptional!=='boolean')fail(at+'.equipmentOptional','boolean required');
      if(technique.entryGroup!==undefined&&!['general','manufacturer'].includes(technique.entryGroup))fail(at+'.entryGroup','unknown entry group');
      if(technique.manufacturerReferences!==undefined){
        if(!Array.isArray(technique.manufacturerReferences))fail(at+'.manufacturerReferences','list required');
        technique.manufacturerReferences.forEach((target,index)=>{
          const location=at+'.manufacturerReferences['+index+']';
          text(target,location);
          if(!own(techniques,target)||techniques[target].entryGroup!=='manufacturer')fail(location,'must reference an existing manufacturer-specific technique');
        });
      }
      const review=technique.review,evidence=technique.evidence;
      if(!object(review)||!['draft','needs-review','reviewed'].includes(review.status))fail(at+'.review','unknown review status');
      text(review.note,at+'.review.note');
      if(review.reviewedOn!==null){
        const date=review.reviewedOn;
        if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)fail(at+'.review.reviewedOn','real YYYY-MM-DD date or null required');
      }
      if(review.status==='reviewed'&&review.reviewedOn===null)fail(at+'.review.reviewedOn','reviewed guidance requires a review date');
      if(!object(evidence)||!['field-guidance','engineering-guidance','manufacturer-backed'].includes(evidence.kind))fail(at+'.evidence','unknown evidence kind');
      text(evidence.note,at+'.evidence.note');
      if(!Array.isArray(evidence.sources))fail(at+'.evidence.sources','list required');
      if(evidence.kind==='manufacturer-backed'&&!evidence.sources.length)fail(at+'.evidence.sources','manufacturer-backed guidance requires exact citations');
      evidence.sources.forEach((source,index)=>{
        const location=at+'.evidence.sources['+index+']';
        if(!object(source))fail(location,'object required');
        for(const field of ['title','revision','locator'])text(source[field],location+'.'+field);
        if(source.url!==undefined){
          text(source.url,location+'.url');
          let url;
          try{url=new URL(source.url)}catch{fail(location+'.url','absolute HTTP(S) URL required')}
          if(!['http:','https:'].includes(url.protocol))fail(location+'.url','absolute HTTP(S) URL required');
        }
      });
      if(!object(technique.nodes)||!own(technique.nodes,technique.start))fail(at+'.start','must name an existing decision node');
      for(const [nodeId,node]of Object.entries(technique.nodes)){
        const location=at+'.nodes.'+nodeId;
        if(!object(node))fail(location,'object required');
        if(node.result===true){
          for(const field of ['domain','assessment','search'])text(node[field],location+'.'+field);
          strings(node.measurements,location+'.measurements');
          if(node.tool!==undefined&&(!toolKeys.includes(node.tool)))fail(location+'.tool','unknown calculator/reference');
          if(node.question!==undefined||node.options!==undefined)fail(location,'result cannot also be a decision');
        }else{
          if(node.result!==undefined)fail(location+'.result','result must be true or omitted');
          text(node.question,location+'.question');
          if(!Array.isArray(node.options)||!node.options.length)fail(location+'.options','nonempty decision options required');
          node.options.forEach((option,index)=>{
            const optionAt=location+'.options['+index+']';
            if(!object(option))fail(optionAt,'object required');
            text(option.label,optionAt+'.label');text(option.next,optionAt+'.next');
            if(option.next.startsWith('flow:')){
              if(!own(techniques,option.next.slice(5)))fail(optionAt+'.next','unknown technique');
            }else if(!own(technique.nodes,option.next))fail(optionAt+'.next','unknown decision/result node');
          });
        }
      }
      if(technique.reviewFlags!==undefined){
        if(!Array.isArray(technique.reviewFlags))fail(at+'.reviewFlags','list required');
        technique.reviewFlags.forEach((flag,index)=>{
          const location=at+'.reviewFlags['+index+']';
          if(!object(flag))fail(location,'object required');
          text(flag.node,location+'.node');text(flag.note,location+'.note');
          if(!own(technique.nodes,flag.node))fail(location+'.node','unknown decision/result node');
          if(!['energized-testing','operating-test','parameter-change','model-specific-limit','source-verification'].includes(flag.category))fail(location+'.category','unknown review category');
        });
        if(review.status==='reviewed'&&technique.reviewFlags.length)fail(at+'.reviewFlags','resolve outstanding flags before marking guidance reviewed');
      }
    }
    const visiting=new Set(),visited=new Set();
    const visit=(id,nodeId)=>{
      const key=id+':'+nodeId;
      if(visiting.has(key))fail(key,'decision cycle has no bounded field procedure');
      if(visited.has(key))return;
      visiting.add(key);
      const node=techniques[id].nodes[nodeId];
      if(!node.result)node.options.forEach(({next})=>{
        if(next.startsWith('flow:')){const target=next.slice(5);visit(target,techniques[target].start)}
        else visit(id,next);
      });
      visiting.delete(key);visited.add(key);
    };
    for(const [id,technique]of Object.entries(techniques))visit(id,technique.start);
    for(const [id,technique]of Object.entries(techniques)){
      for(const nodeId of Object.keys(technique.nodes)){
        if(!visited.has(id+':'+nodeId))fail(id+':'+nodeId,'unreachable decision/result node');
      }
    }
    return library;
  }
  globalThis.TRACER_TECHNIQUES_API={validate};
})();
