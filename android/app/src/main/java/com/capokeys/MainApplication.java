package nicholaslie.guitarcapohelper;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.idehub.Billing.InAppBillingBridgePackage;
import com.sbugert.rnadmob.RNAdMobPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new InAppBillingBridgePackage("MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoDSG04oLa5KhBnl7DmMd9dkSy7AX6v98ABDD3pFzSckyxYGio0yQTPBvPBeL/RQVc2fJHYLHU7RZWqS8NaYCihc/U1Ui+a7dIS7g9fGQtxXT9czTWfHFElt71HZB0sRX8C//P9McPBXUOzwzJmM6ybjHnm4oCny5Vy3LYREcon5ad5hfRvNlJLxoQQrHB8+JfQRuLmSE+Z7S6X3fNpfBiQCLd/5qZ4hO+5ahV+Vg3io4k8ZK4EuzqPZ0jPV9fdkG6jAKs3XxB6FQHdmlIlk7bg1o+xS84p8GbcA26G0pm2zP0H4qZGTrk05SZbvXyX7zo2rJzRZrHEnJuLk+1M06bQIDAQAB"),
            new RNAdMobPackage(),
            new VectorIconsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
