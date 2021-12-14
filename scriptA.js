const app = {
    initialize: () => {
        app.client = contentful.createClient({
          space: "fvu0xvbs4745",
          accessToken: "HCC2xlChZlg8Jed8Ae0iiY49TA6obeRBh533rxmuWts"
        });
      },
    
      getEntry: entry => {
        // a known issue with the contentful library is that embedded images are ignored in rich text
        // this is the current workaround: https://github.com/contentful/rich-text/issues/61
        const options = {
          renderNode: {
              'embedded-asset-block': ({ data: { target: { fields }}}) => {
                return `<img src="${fields.file.url}" height="${fields.file.details.image.height}" width="${fields.file.details.image.width}" alt="${fields.description}"/>`;
              }
          }
        };
        app.client.getEntry(entry).then(project => {
          const projectData = {
            title: About.fields.title,
            // imageUrl: `http:${About.fields.image.fields.file.url}`,
            // imageUrl2: `http:${project.fields.image2.fields.file.url}`,
            // imageTitle: project.fields.image.fields.title,
            description:  About.fields.aboutMe ? documentToHtmlString(About.fields.aboutMe, options) : '' // passing in the options obj i created above for the bug
            
        };
          
          fetch('About.mustache')
    
            .then(response => response.text())
            .then(template => {
         
              const rendered = Mustache.render(template, projectData);
        
              $('.containerA').append(rendered);
            }
          );
        });
      },
}