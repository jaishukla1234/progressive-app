import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  standalone: true
})
export class TestComponent {

  public backgroundFetchUrl: string = 'https://onlinetestcase.com/wp-content/uploads/2023/06/1.5-MB.pdf';

  constructor(
    private api: ApiService
  ) { }

  getData() {
    this.api.getUsers().subscribe((res) => {
      console.log(res, 'GOT USERS');
    }, (error) => {
      this.api.backgroundSync('get-users')
    })
  }

  notifyMe() {

  }
  downloadFile() {
    // const urls = ['https://onlinetestcase.com/wp-content/uploads/2023/06/1.5-MB.pdf'];
    // navigator.serviceWorker.ready.then(async (swRegisteration:any)=>{
    //  const bgFetch  = swRegisteration.backgroundFetch.fetch('my-fetch',urls,{
    //   title:'Excel file',
    //   icons:[
    //     {
    //       sizes:'72x72',
    //       src:'../../assets/icons/android/android-launchericon-72-72.png',
    //       type:'application/pdf'
    //     }]
    //  })
    // })
    console.log(1111111111111111111);
    navigator.serviceWorker.ready.then(async (swReg: any) => {
      console.log(22222222222222);

      console.log(swReg, 'REG')
      const bgFetch = await swReg.backgroundFetch.fetch(
        "my-fetch",
        ["https://speed.hetzner.de/100MB.bin"
        ],

        {
          title: "Big file",
          icons: [
            {
              sizes: "300x300",
              src: "../../assets/icons/android/android-launchericon-48-48.png",
              type: "image/png",
            },
          ],
          downloadTotal: 14 * 1024 * 1024,
        },
      );

      this.monitorBgFetch(bgFetch);

      console.log(bgFetch, 'BACKGROUND FETCH ########');
    });
  }
  async performBackgroundFetch() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const controller = registration.active;

      const backgroundFetch = await (self as any).backgroundFetch.fetch(
        'backgroundFetch',
        [this.backgroundFetchUrl],
        { title: 'Background Fetch' }
      );

      backgroundFetch.addEventListener('backgroundfetchsuccess', (event: any) => {
        const fetchRecords = event.fetches;
        fetchRecords.forEach((fetchRecord: any) => {
          // Handle the fetch success and process the fetched data here
          console.log('Background Fetch Success:', fetchRecord);
        });
      });

      backgroundFetch.addEventListener('backgroundfetchfail', (event: any) => {
        const fetchRecords = event.fetches;
        fetchRecords.forEach((fetchRecord: any) => {
          // Handle the fetch failure here
          console.error('Background Fetch Failed:', fetchRecord);
        });
      });
    } catch (error) {
      console.error('Background Fetch Error:', error);
    }
  }


  async monitorBgFetch(bgFetch:any) {
    function doUpdate() {
      const update:any = {};

      if (bgFetch.result === '') {
        update.state = 'fetching';
        update.progress = bgFetch.downloaded / bgFetch.downloadTotal;
      } else if (bgFetch.result === 'success') {
        update.state = 'fetching';
        update.progress = 1;
      } else if (bgFetch.failureReason === 'aborted') { // Failure
        update.state = 'not-stored';
      } else { // other failure
        update.state = 'failed';
      }


    };

    doUpdate();

    bgFetch.addEventListener('progress', doUpdate);
    const channel = new BroadcastChannel(bgFetch.id);

    channel.onmessage = (event) => {
      if (!event.data.stored) return;
      bgFetch.removeEventListener('progress', doUpdate);
      channel.close();
     console.log('updated @@@@@@');
    };
  }
}
