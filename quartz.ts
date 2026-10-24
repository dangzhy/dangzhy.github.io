import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { PageTypeDispatcher } from "./quartz/plugins/pageTypes/dispatcher"
import { StudyArticleList, StudyTags } from "./quartz/components/StudyDesk"

const config = await loadQuartzConfig()
if (process.env.SITE_BASE_URL) {
  config.configuration.baseUrl = process.env.SITE_BASE_URL.replace(/^https?:\/\//, "").replace(
    /\/$/,
    "",
  )
}
const base = await loadQuartzLayout()
export const layout = {
  defaults: {
    ...base.defaults,
    left: [...(base.defaults.left ?? []), StudyTags],
    afterBody: [StudyArticleList],
  },
  byPageType: base.byPageType,
}
config.plugins.emitters = config.plugins.emitters.filter(
  (emitter) => emitter.name !== "PageTypeDispatcher",
)
config.plugins.emitters.push(PageTypeDispatcher(layout))
export default config
