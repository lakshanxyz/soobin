exports.run = {
   usage: ['apk'],
   hidden: ['getapk'],
   use: 'query',
   category: 'downloader',
   async: async (m, {
      client,
      text,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (command == 'apk') {
            if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'fb lite'), m)
            client.sendReact(m.chat, 'β¨', m.key)
            let json = await Api.apk(text)
            if (!json.status) return client.reply(m.chat, global.status.fail, m)
            let rows = []
            json.data.map(async (v, i) => {
               rows.push({
                  title: v.name,
                  rowId: `${isPrefix}getapk ${text}β${v.no}`,
                  description: `[ ${v.size} | ${v.version} ]`
               })
            })
            client.sendList(m.chat, '', `Showing search results for : β${text}β, select below the application you want to download. π`, '', 'Tap!', [{
               rows
            }], m)
         } else if (command == 'getapk') {
            if (!text) return client.reply(m.chat, global.status.invalid, m)
            let [query, no] = text.split`β`
            client.sendReact(m.chat, 'β¨', m.key)
            let json = await Api.apk(query, no)  
            let teks = `δΉ  *P L A Y S T O R E*\n\n`
            teks += '	β¦  *Name* : ' + json.data.name + '\n'
            teks += '	β¦  *Version* : ' + json.data.version + '\n'
            teks += '	β¦  *Size* : ' + json.file.size + '\n'
            teks += '	β¦  *Category* : ' + json.data.category + '\n'
            teks += '	β¦  *Developer* : ' + json.data.developer + '\n'
            teks += '	β¦  *Requirement* : ' + json.data.requirement + '\n'
            teks += '	β¦  *Publish* : ' + json.data.publish + '\n'
            teks += '	β¦  *Link* : ' + json.data.playstore + '\n\n'
            teks += global.footer
            let chSize = Func.sizeLimit(json.file.size, global.max_upload)
            if (chSize.oversize) return client.reply(m.chat, `π File size (${json.file.size}) exceeds the maximum limit, download it by yourself via this link : ${await (await Func.shorten(json.file.url)).data.url}`, m)
            client.sendFile(m.chat, json.data.thumbnail, '', teks, m).then(() => {
               client.sendFile(m.chat, json.file.url, json.file.filename, '', m)
            })
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   limit: true,
   restrict: true,
}
