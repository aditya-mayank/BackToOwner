import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const reactHooks = ['useState', 'useEffect', 'useRef', 'useContext', 'useCallback', 'useMemo'];
const routerHooks = ['useNavigate', 'useLocation', 'useParams', 'Link', 'NavLink', 'Navigate', 'useSearchParams'];
const framerHooks = ['motion', 'AnimatePresence', 'useInView', 'useAnimation', 'useScroll', 'useTransform'];
const authHooks = ['useAuth'];

walkDir('src', function(filePath) {
  if (!filePath.endsWith('.jsx')) return;
  if (filePath.replace(/\\/g, '/').includes('App.jsx')) return; // Skip App.jsx manually since it's already perfect and uses unique components like AuthProvider
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Find which ones are used (crude string pattern to avoid matching substring in other words like variable names)
  let usedReact = reactHooks.filter(h => new RegExp(`\\b${h}\\b`).test(content));
  let usedRouter = routerHooks.filter(h => new RegExp(`\\b${h}\\b`).test(content));
  let usedFramer = framerHooks.filter(h => new RegExp(`\\b${h}\\b`).test(content));
  let usedAuth = authHooks.filter(h => new RegExp(`\\b${h}\\b`).test(content));

  if (usedReact.length === 0 && usedRouter.length === 0 && usedFramer.length === 0 && usedAuth.length === 0) return;

  // Remove existing imports loosely for these specific packages to avoid duplication
  let lines = content.split('\n');
  let bodyLines = [];
  
  lines.forEach(line => {
    if (line.startsWith('import ')) {
      const matchReact = line.match(/from\s+['"]react['"]/);
      const matchRouter = line.match(/from\s+['"]react-router-dom['"]/);
      const matchFramer = line.match(/from\s+['"]framer-motion['"]/);
      const matchAuth = line.includes('AuthContext');
      
      if (matchReact || matchRouter || matchFramer || matchAuth) {
        // skip old import
      } else {
        bodyLines.push(line);
      }
    } else {
      bodyLines.push(line);
    }
  });

  let newImports = [];
  
  // Add React import - including React if it was historically there
  if (usedReact.length > 0) {
    newImports.push(`import React, { ${usedReact.join(', ')} } from 'react'`);
  } else if (originalContent.includes('import React')) {
    newImports.push(`import React from 'react'`);
  }

  // Add React Router import
  if (usedRouter.length > 0) {
    newImports.push(`import { ${usedRouter.join(', ')} } from 'react-router-dom'`);
  }
  
  // Add framer motion import
  if (usedFramer.length > 0) {
    newImports.push(`import { ${usedFramer.join(', ')} } from 'framer-motion'`);
  }
  
  // Add auth context import based on path
  if (usedAuth.length > 0) {
    const isRootSrc = path.dirname(filePath).replace(/\\/g, '/') === 'src';
    const authPath = isRootSrc ? './context/AuthContext' : '../context/AuthContext';
    // EXCEPT inside AuthContext itself!
    if (!filePath.replace(/\\/g, '/').includes('AuthContext')) {
      newImports.push(`import { useAuth } from '${authPath}'`);
    } else {
        newImports = newImports.filter(imp => !imp.includes('react'))
        newImports.push(`import React, { createContext, useContext, useState, useEffect } from 'react'`)
    }
  }

  if (filePath.replace(/\\/g, '/').includes('AuthContext')) {
    let hasReact = false;
    for (let i = 0; i < newImports.length; i++) {
        if (newImports[i].includes("'react'")) {
            newImports[i] = `import React, { createContext, useContext, useState, useEffect } from 'react'`;
            hasReact = true;
        }
    }
    if (!hasReact) newImports.push(`import React, { createContext, useContext, useState, useEffect } from 'react'`);
  }

  let finalContent = newImports.join('\n') + '\n\n' + bodyLines.join('\n');
  
  finalContent = finalContent.replace(/^\s*\n/gm, '');

  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log('Fixed', filePath);
});
