import { CacheBuster } from "react-cache-buster/dist/CacheBuster"
import Router from "./router/Router"
import { version } from '../package.json';
import Spinner from "./components/spinner";

function App() {
  const isEnabled = process.env.NODE_ENV === 'production';

  return (
    <CacheBuster
      currentVersion={version}
      isEnabled={isEnabled} //If false, the library is disabled.
      isVerboseMode={false} //If true, the library writes verbose logs to console.
      loadingComponent={<></>} //If not pass, nothing appears at the time of new version check.
      metaFileDirectory={'.'} //If public assets are hosted somewhere other than root on your server.
    >
      <Router />
    </CacheBuster>
  )
}

export default App
